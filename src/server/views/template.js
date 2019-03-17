export default ({ state, body }) => `
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Flavio De Stefano - aka @kopiro</title>
        <meta name="author" content="Flavio De Stefano" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="/css/style.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/simple-line-icons/2.4.1/css/simple-line-icons.css" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
    </head>
    <body>
        <div id="root">${body}</div>
        <script>window.__STATE__ = ${JSON.stringify(state)};</script>
        <script src="/js/bundle.js"></script>
        <script>
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-20966409-1']);
        _gaq.push(['_trackPageview']);
        (function() {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src =
                ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') +
                '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();
        </script>
    </body>
</html>`;
