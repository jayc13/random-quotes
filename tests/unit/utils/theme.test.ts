import { systemTheme } from '../../../src/utils/theme';

describe('systemTheme', () => {
  it('should return "light" when window or window.matchMedia is not available', () => {
    const originalWindow = global.window;

    // Test case 1: window is not available
    // @ts-expect-error - we are intentionally deleting window for testing purposes
    delete global.window;
    expect(systemTheme()).toBe('light');

    // Restore window
    global.window = originalWindow;

    // Test case 2: window.matchMedia is not available
    const originalMatchMedia = global.window.matchMedia;
    global.window.matchMedia = undefined as any;
    expect(systemTheme()).toBe('light');

    // Restore window.matchMedia
    global.window.matchMedia = originalMatchMedia;
  });
});
