export default function () {
    let request = new XMLHttpRequest();
    request.open(
        "GET",
        "/dist/icons/icons-sprite.svg",
        true
    );

    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            // Success!
            document.body.children[0].insertAdjacentHTML(
                "beforebegin",
                request.responseText
            );
        } else {
            console.error("Icons could not be fetched.");
        }
    };

    request.onerror = function () {
        console.error("Icons could not be fetched.");
    };

    request.send();
}
