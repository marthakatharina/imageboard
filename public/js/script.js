(function () {
    Vue.component("my-component", {
        template: "#template",
        props: ["id"],
        data: function () {
            return {
                image: "",
                comments: [],
                comment: "",
                username: "",
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
            title: "",
            description: "",
            username: "",
            file: null,
        },
        mounted: function () {
            const me = this;
            addEventListener("hashchange", function () {
                console.log("hash changed");
                me.selectedImage = location.hash.slice(1);
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

            openModal: function (id) {
                console.log("openModel is running!!!!");
                console.log("id: ", id);
                this.selectedImage = id;
            },

            closeModal: function () {
                console.log("closeModel is running!!!!");
                // this.selectedImage = null;
                location.hash = "";
            },

            // resetInput: function () {
            //     this.title = "";
            //     this.description = "";
            //     this.username = "";
            // },
        },
    });
})();
