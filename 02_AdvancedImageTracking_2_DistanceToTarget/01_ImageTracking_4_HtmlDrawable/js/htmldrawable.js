var World = {

    init: function initFn() {
        this.createOverlays();
    },

    createOverlays: function createOverlaysFn() {

        this.targetCollectionResource = new AR.TargetCollectionResource("assets/shops.wtc", {
            onError: World.onError
        });

        this.tracker = new AR.ImageTracker(this.targetCollectionResource, {
            onTargetsLoaded: World.showInfoBar,
            onError: World.onError
        });

        this.imgButton = new AR.ImageResource("assets/wwwButton.jpg", {
            onError: World.onError
        });

        /* Create overlay for page one of the magazine. */
        var imgOne = new AR.ImageResource("assets/imageOne.png", {
            onError: World.onError
        });
        var overlayOne = new AR.ImageDrawable(imgOne, 1, {
            translate: {
                x: -0.15
            }
        });

        var pageOneButton = this.createWwwButton("https://ribbonsandballoons.com/", 0.1, {
            translate: {
                x: -0.25,
                y: -0.25
            },
            zOrder: 1
        });


        var weatherWidget = new AR.HtmlDrawable({
            uri: "assets/weather.html"
        }, 0.25, {
            viewportWidth: 320,
            viewportHeight: 100,
            backgroundColor: "#FFFFFF",
            translate: {
                x: 0.36,
                y: 0.5
            },
            horizontalAnchor: AR.CONST.HORIZONTAL_ANCHOR.RIGHT,
            verticalAnchor: AR.CONST.VERTICAL_ANCHOR.TOP,
            clickThroughEnabled: true,
            allowDocumentLocationChanges: false,
            onDocumentLocationChanged: function onDocumentLocationChangedFn(uri) {
                AR.context.openInBrowser(uri);
            },
            onError: World.onError
        });

        /*
            This combines everything by creating an AR.ImageTrackable with the previously created tracker,
            the name of the image target and the drawable that should augment the recognized image.

            Important: If you replace the tracker file with your own, make sure to change the target name accordingly.
            Use a specific target name to respond only to a certain target or use a wildcard to respond to any or a
            certain group of targets.
        */
        this.pageOne = new AR.ImageTrackable(this.tracker, "pageOne", {
            drawables: {
                cam: [overlayOne, pageOneButton, weatherWidget]
            },
            onImageRecognized: World.hideInfoBar,
            onError: World.onError
        });
    },

    onError: function onErrorFn(error) {
        alert(error);
    },

    createWwwButton: function createWwwButtonFn(url, size, options) {
        /*
            As the button should be clickable the onClick trigger is defined in the options passed to the
            AR.ImageDrawable. In general each drawable can be made clickable by defining its onClick trigger. The
            function assigned to the click trigger calls AR.context.openInBrowser with the specified URL, which
            opens the URL in the browser.

        */
        options.onClick = function() {
            AR.context.openInBrowser(url);
        };
        return new AR.ImageDrawable(this.imgButton, size, options);
    },

    hideInfoBar: function hideInfoBarFn() {
        document.getElementById("infoBox").style.display = "none";
    },

    showInfoBar: function worldLoadedFn() {
        document.getElementById("infoBox").style.display = "table";
        document.getElementById("loadingMessage").style.display = "none";
    }
};

World.init();