const { sum, getHealth } = require('./index');
const axios = require('axios');

jest.mock('axios');

beforeEach(() => {
  jest.clearAllMocks();
});

// Existing sum tests
test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3);
});

test('adds 0 + 0 to equal 0', () => {
  expect(sum(0, 0)).toBe(0);
});

test('adds negative numbers correctly', () => {
  expect(sum(-1, -2)).toBe(-3);
});

// New tests for URL pinging functionality
describe('getHealth', () => {
  const testURL = 'https://example.com';

  test('successfully pings URL', async () => {
    axios.get.mockResolvedValue({ data: 'pong' });
    const result = await getHealth(testURL);
    expect(axios.get).toHaveBeenCalledWith(testURL);
    expect(result).toBe('pong');
  });

  test('handles failed ping', async () => {
    const errorMessage = 'Network Error';
    axios.get.mockRejectedValue(new Error(errorMessage));
    const consoleSpy = jest.spyOn(console, 'log');

    await getHealth(testURL);
    
    expect(axios.get).toHaveBeenCalledWith(testURL);
    expect(consoleSpy).toHaveBeenCalledWith(
      '🚀 ~ file: index.js:23 ~ error:',
      expect.objectContaining({ message: errorMessage })
    );
  });
});