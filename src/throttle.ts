export const throttle = (
  callback: (e: MouseEvent) => void,
  delay: number
): ((e: MouseEvent) => void) => {
  let throttleTimeout: number | null = null;
  let storedEvent: MouseEvent | null = null;

  const throttledEventHandler = (event: MouseEvent) => {
    storedEvent = event;

    const shouldHandleEvent = !throttleTimeout;

    console.log('Event', event.offsetX);
    if (shouldHandleEvent) {
      callback(storedEvent);

      storedEvent = null;

      const throttled = function () {
        throttleTimeout = null;

        if (storedEvent) {
          console.log(
            'Calling with stored event',
            storedEvent.offsetX,
            event.offsetX
          );
          throttledEventHandler(storedEvent);
        }
      };

      throttleTimeout = window.setTimeout(throttled, delay);
    }
  };

  return throttledEventHandler;
};
