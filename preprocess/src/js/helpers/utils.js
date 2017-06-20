/**
 * Debounce function for animation
 *
 * @param callback
 * @param wait
 * @param context
 * @return {Function}
 *
 * Source: https://gist.github.com/beaucharman/1f93fdd7c72860736643d1ab274fee1a
 *
 * Usage:
 * const handleScroll = debounce((e) => {
 *   console.log('Window scrolled.');
 * }, 100);
 *
 * window.addEventListener('scroll', handleScroll);
 */
export function debounce(callback, wait, context = this) {
    let timeout = null;
    let callbackArgs = null;
    const later = () => callback.apply(context, callbackArgs);
    return function() {
        callbackArgs = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for animation
 *
 * @param callback
 * @param wait
 * @param context
 * @return {Function}
 *
 * Source: https://gist.github.com/beaucharman/e46b8e4d03ef30480d7f4db5a78498ca
 *
 * Usage:
 * const handleKeydown = throttle((e) => {
 *   console.log(e.target.value)
 * }, 300)
 *
 * input.addEventListener('keydown', handleKeydown)
 */
export function throttle(callback, wait, context = this) {
    let timeout = null;
    let callbackArgs = null;
    const later = () => {
        callback.apply(context, callbackArgs);
        timeout = null;
    };
    return function() {
        if (!timeout) {
            callbackArgs = arguments;
            timeout = setTimeout(later, wait);
        }
    };
}

/**
 * Get the scroll position
 *
 * Replace jQuery function: jQuery(window).scrollTop()
 *
 * @returns {Number|number}
 */
export function getScrollPosition() {
    return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

const Utils = {
    ajax: function(data, type) {
        let request = new XMLHttpRequest();
        request.open(type, data.url);

        if (type === 'POST') {
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        }

        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                data.success(request);
            } else {
                // We reached our target server, but it returned an error
                data.error(request);
            }
        };

        request.onerror = () => {
            // There was a connection error of some sort
            data.error(request);
        };

        let sendData = type === 'POST'
            ? data.data
            : '';

        request.send(sendData);
    }
};
export default Utils;
