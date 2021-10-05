import sinon from 'sinon';
export const mochaHooks = {
  afterEach: (): void => {
    sinon.restore();
  }
};
