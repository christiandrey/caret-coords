/**
 * Returns the coordinates of the caret
 * @returns The top and left coordinates of the caret
 */
export function getCaretCoordinates() {
	const document = window.document;

	const computedSelection = window.getSelection();
	let x = 0;
	let y = 0;
	let range: Range | undefined = undefined,
		clientRects: DOMRectList,
		clientRect: DOMRect;

	if (computedSelection && computedSelection.rangeCount) {
		range = computedSelection.getRangeAt(0).cloneRange();

		if (range.getClientRects) {
			range.collapse(true);
			clientRects = range.getClientRects();

			if (clientRects.length > 0) {
				clientRect = clientRects[0];

				x = clientRect.left;
				y = clientRect.top;

				if (x !== 0 && y !== 0) {
					return {x, y};
				}
			}
		}
	}

	// -----------------------------------------------------------------
	// Fallback: Insert a new temporary element at the caret position,
	// get its dimensions and remove.
	// -----------------------------------------------------------------
	const temporaryElement = document.createElement('span');

	if (temporaryElement.getClientRects) {
		// -----------------------------------------------------------------
		// Insert a zero width character to ensure span has dimensions.
		// -----------------------------------------------------------------
		temporaryElement.appendChild(document.createTextNode('\u200b'));

		range?.insertNode(temporaryElement);
		clientRect = temporaryElement.getClientRects()[0];

		x = clientRect.left;
		y = clientRect.top;

		// -----------------------------------------------------------------
		// Cleanup and normalize.
		// -----------------------------------------------------------------
		const temporaryElementParent = temporaryElement.parentNode;

		temporaryElementParent?.removeChild(temporaryElement);
		temporaryElementParent?.normalize();
	}

	return {x, y};
}
