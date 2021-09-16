import {isNaN} from 'lodash';
import ZSchema from 'z-schema';

export class TestUtilsZSchemaFormatter {
  static format(): void {
    // Placeholder file for all custom-formats in known to swagger.json
    // as found on
    // https://github.com/OAI/OpenAPI-Specification/blob/master/versions/2.0.md#dataTypeFormat

    const decimalPattern = /^\d{0,8}.?\d{0,4}[0]+$/;

    /** Validates floating point as decimal / money (i.e: 12345678.123400..) */
    ZSchema.registerFormat('double', (val) => {
      return !decimalPattern.test(val.toString());
    });

    /** Validates value is a 32bit integer */
    ZSchema.registerFormat('int32', (val) => {
      // the 32bit shift (>>) truncates any bits beyond max of 32
      return Number.isInteger(val) && ((val >> 0) === val);
    });

    ZSchema.registerFormat('int64', (val) => {
      return Number.isInteger(val);
    });

    ZSchema.registerFormat('float', (val) => {
      return !isNaN(Number.parseFloat(val));
    });

    ZSchema.registerFormat('date', (val) => {
      // should parse a a date
      return !isNaN(Date.parse(val));
    });

    ZSchema.registerFormat('dateTime', (val) => {
      return !isNaN(Date.parse(val));
    });

    ZSchema.registerFormat('password', (val) => {
      // should parse as a string
      return typeof val === 'string';
    });
  }
}