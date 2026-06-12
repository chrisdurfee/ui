/**
 * Guard against rapid repeated `.open()` calls that would otherwise stack
 * multiple identical overlays on top of each other (e.g. a user tapping a
 * button several times before the open animation completes).
 *
 * The lock is module-scoped so it covers every overlay type (Modal, Drawer,
 * Dialog, etc.). It releases when the in-flight overlay is torn down or
 * after a short safety timeout, whichever comes first.
 */
const OPEN_LOCK_TIMEOUT_MS = 700;
let openingLock = false;
let openingLockTimer = null;

/**
 * Release the open lock and clear the safety timer.
 *
 * @returns {void}
 */
export const releaseOpenLock = () =>
{
	openingLock = false;
	if (openingLockTimer)
	{
		// @ts-ignore
		globalThis.clearTimeout(openingLockTimer);
		openingLockTimer = null;
	}
};

/**
 * Try to acquire the open lock. Returns false if another overlay is
 * currently opening. The lock auto-releases after a safety timeout.
 *
 * @returns {boolean} True if the lock was acquired.
 */
export const acquireOpenLock = () =>
{
	if (openingLock)
	{
		return false;
	}

	openingLock = true;
	// @ts-ignore
	openingLockTimer = globalThis.setTimeout(releaseOpenLock, OPEN_LOCK_TIMEOUT_MS);
	return true;
};
