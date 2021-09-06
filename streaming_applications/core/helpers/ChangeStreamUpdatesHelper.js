'use strict';
const _ = require('lodash');

/**
 * Remap fields when the update field matched a field on the field config
 *
 * @param {Object} mapItem - One field configuration object {from: '', to: '', [properties: []]}
 * @param {Object} updates - Change stream delta updates
 * @param {String} field - Field name from updates
 * @returns Object
 * @private
 */
function _topLevelMatch(mapItem, updates, field) {
  const mapped = {};
  if (mapItem.properties) {
    if (_.isPlainObject(updates[field])) {
      const subFields = updates[field];
      mapItem.properties.forEach((prop) => {
        if (!_.isUndefined(subFields[prop.from])) {
          if (mapped[mapItem.to]) {
            mapped[mapItem.to][prop.to] = subFields[prop.from];
          } else {
            mapped[mapItem.to] = {[prop.to]: subFields[prop.from]};
          }
        }
      });
    } else {
      mapped[mapItem.to] = updates[field];
    }
  } else {
    mapped[mapItem.to] = updates[field];
  }

  return mapped;
}

/**
 * Remap fields for dot notation update field
 *
 * @param {Object} mapItem - One field configuration object {from: '', to: '', [properties: []]}
 * @param {Object} updates - Change stream delta updates
 * @param {String} field - Top Level field name from dot notation update
 * @param {Array} fieldParts - The sub fields of the top level field
 * @returns Object
 * @private
 */
function _dotNotationTopLevelMatch(mapItem, updates, field, fieldParts) {
  const mapped = {};
  const subField = fieldParts.join('.');
  if (mapItem.properties) {
    const subFieldMap = mapItem.properties.find((prop) => prop.from === subField);
    if (subFieldMap) {
      mapped[`${mapItem.to}.${subFieldMap.to}`] = updates[field];
    }
  } else {
    mapped[`${mapItem.to}.${subField}`] = updates[field];
  }

  return mapped;
}

/**
 * Rename updates fields based off of the provided field config
 * TODO Support recursion on nested properties, positional array updates, $addToSet and other operations
 *
 * @param {Object} fieldConfig - Fields mapping from source to how it should look in destination collection
 * @param {Object} updates - Change stream delta updates
 *
 * @returns Object
 */
function remapUpdateFields(fieldConfig, updates) {
  const mapped = {};
  for (const field of Object.keys(updates)) {
    const fieldParts = field.split('.');
    const topLevel = fieldParts.shift();
    for (const mapItem of fieldConfig) {
      if (field === mapItem.from) {
        _.extend(mapped, _topLevelMatch(mapItem, updates, field));
      } else if (topLevel === mapItem.from) {
        _.extend(mapped, _dotNotationTopLevelMatch(mapItem, updates, field, fieldParts));
      } else if (mapItem.from.startsWith(`${field}.`)) {
        mapped[mapItem.to] = _.get(updates, mapItem.from, updates[field]);
      }
    }
  }
  return mapped;
}

module.exports = {
  remapUpdateFields
};