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

        this.pageOne = new AR.ImageTrackable(this.tracker, "pageOne", {
            drawables: {
                cam: [overlayOne, pageOneButton]
            },
            onImageRecognized: World.hideInfoBar,
            onError: World.onError
        });

        var imgTwo = new AR.ImageResource("assets/imageTwo.jpg", {
            onError: World.onError
        });
        var overlayTwo = new AR.ImageDrawable(imgTwo, 0.5, {
            translate: {
                x: 0.12,
                y: -0.01
            }
        });

        var pageTwoButton = this.createWwwButton(
            "http://bananaleafindia.com/",
            0.15, {
                translate: {
                    y: -0.25
                },
                zOrder: 1
            }
        );

        /*
            The AR.ImageTrackable for the second page uses the same tracker but with a different target name and the
            second overlay.
        */
        this.pageTwo = new AR.ImageTrackable(this.tracker, "pageTwo", {
            drawables: {
                cam: [overlayTwo, pageTwoButton]
            },
            onImageRecognized: World.hideInfoBar,
            onError: World.onError
        });
    },

    onError: function onErrorFn(error) {
        alert(error);
    },

    createWwwButton: function createWwwButtonFn(url, size, options) {

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