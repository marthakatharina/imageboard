(function () {
    Vue.component("my-component", {
        template: "#template",
        props: ["id", "url"],
        data: function () {
            return {
                image: "",
                comments: [],
                comment: "",
                username: "",
                link: "",
            };
        },

        watch: {
            id: function () {
                let me = this;
                axios
                    .get(`/images/${this.id}`)
                    .then(function (response) {
                        me.image = response.data[0];
                    })
                    .catch(function (err) {
                        console.log("error in GET /images/: ", err);
                    });
                axios
                    .get(`/comments/${this.id}`)
                    .then(function (response) {
                        me.comments = response.data;
                        // me.username = response.data;
                    })
                    .catch(function (err) {
                        console.log("error in GET /comments ", err);
                    });
            },
        },

        mounted: function () {
            console.log("this: ", this);
            let me = this;
            axios
                .get(`/images/${this.id}`)
                .then(function (response) {
                    me.image = response.data[0];
                })
                .catch(function (err) {
                    console.log("error in GET /images/: ", err);
                });
            axios
                .get(`/comments/${this.id}`)
                .then(function (response) {
                    me.comments = response.data;
                    // me.username = response.data;
                })
                .catch(function (err) {
                    console.log("error in GET /comments ", err);
                });
        },
        methods: {
            handleClickComment: function (e) {
                e.preventDefault();
                let me = this;
                console.log("this: ", this);
                console.log("this.comments: ", this.comments);
                var newComment = {};

                newComment.id = this.id;
                newComment.username = this.username;
                newComment.comment = this.comment;

                axios
                    .post("/comment", { newComment })
                    .then(function (response) {
                        console.log("me.comments: ", me.comments);
                        console.log("response from POST /comment: ", response);
                        me.comments.unshift(response.data.rows);
                        console.log("response.data: ", response.data);
                    })
                    .catch(function (err) {
                        console.log("err in POST /comment: ", err);
                    });

                me.comment = "";
                me.username = "";
            },

            closeModal: function () {
                this.$emit("close");
            },
        },
    });

    new Vue({
        el: "#main",
        data: {
            selectedImage: location.hash.slice(1), //null, // image.id
            images: [],
            links: [],
            title: "",
            description: "",
            username: "",
            file: null,

            url: "",
            selectedLink: location.hash.slice(1),
        },
        mounted: function () {
            const me = this;
            addEventListener("hashchange", function () {
                console.log("hash changed");
                me.selectedImage = location.hash.slice(1);
                me.selectedLink = location.hash.slice(1);
            });

            let self = this;
            axios
                .get("/images")
                .then(function (response) {
                    self.images = response.data;
                })
                .catch(function (err) {
                    console.log("error in GET / images: ", err);
                });

            axios
                .get("/links")
                .then(function (response) {
                    self.links = response.data;
                })
                .catch(function (err) {
                    console.log("error in GET / links: ", err);
                });
        },

        methods: {
            handleClick: function (e) {
                e.preventDefault();
                console.log("this: ", this); // this access everything inside data:{}

                var formData = new FormData(); // formData sends stuff to the server axios
                formData.append("title", this.title);
                formData.append("description", this.description);
                formData.append("username", this.username);
                formData.append("file", this.file);

                // no console.log needed here, it will show an empty obj
                var self = this;
                axios
                    .post("/images", formData)
                    .then(function (response) {
                        console.log("response from POST / images: ", response);
                        self.images.unshift(response.data.rows);
                    })
                    .catch(function (err) {
                        console.log("err in POST /images: ", err);
                    });

                this.title = "";
                this.description = "";
                this.username = "";
            },
            handleClickLink: function (e) {
                e.preventDefault();
                console.log("this: ", this);

                var link = {};

                link.url = this.url;

                var to = this;

                axios
                    .post("/links", { link })
                    .then(function (response) {
                        console.log("response from POST / links: ", response);
                        console.log("to.links: ", to.links);
                        console.log("response.data: ", response.data);

                        to.links.unshift(response.data.rows);
                    })
                    .catch(function (err) {
                        console.log("err in POST /links: ", err);
                    });

                // this.img = document.createElement("img");

                // this.img.url = this.url;

                // this.links.unshift(this.img);

                this.url = "";
            },

            getMore: function (e) {
                e.preventDefault();
                console.log("click: ");
                var self = this;
                var lastId = this.images[this.images.length - 1].id;

                axios
                    .get(`/more/${lastId}`)
                    .then(function (response) {
                        console.log("response from getMore / more: ", response);

                        for (let i = 0; i < response.data.length; i++) {
                            self.images.push(response.data[i]);
                            console.log("self.images", self.images);
                        }
                    })
                    .catch(function (err) {
                        console.log("err in getMore: ", err);
                    });
            },

            handleChange: function (e) {
                console.log("handleChange is running!!!!");
                console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
            },
            handleChangeLink: function (e) {
                console.log("handleChange is running!!!!");
                console.log("link: ", e.target.value);
                this.url = e.target.value;
            },

            openModal: function (id, url) {
                console.log("openModel is running!!!!");
                console.log("id: ", id);
                this.selectedImage = id;
                this.selectedLink = url;
            },

            closeModal: function () {
                console.log("closeModel is running!!!!");
                // this.selectedImage = null;
                location.hash = "";
            },

            // resetInput: function () {
            //     // this.title = "";
            //     // this.description = "";
            //     // this.username = "";
            //     // this.url = "";
            // },
        },
    });
})();
