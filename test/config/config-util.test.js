/* eslint-disable no-undef */
const { getDelimiter } = require('../../src/config/config-util');

describe('## config-util.js', () => {
  test('Should resolve comma and space', () => {
    const delimiter = getDelimiter('what, you, want');
    expect(delimiter).toEqual(', ');
  });

  test('Should resolve comma only', () => {
    const delimiter = getDelimiter('what,you,need');
    expect(delimiter).toEqual(',');
  });

  test('Should resolve space  only', () => {
    const delimiter = getDelimiter('but you say you\'re');
    expect(delimiter).toEqual(' ');
  });
});
