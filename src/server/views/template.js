export default ({ body }) => `<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Flavio De Stefano - aka @kopiro</title>
        <meta name="author" content="Flavio De Stefano" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />

<link href="https://fonts.googleapis.com/css?family=Space+Mono&display=swap" rel="stylesheet">
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    </head>
    <body>
        <div id="root">${body}</div>
    </body>
</html>`;
