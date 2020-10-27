(function () {
    new Vue({
        el: "#main",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: null,
        },
        mounted: function () {
            let self = this;
            axios.get("/images").then(function (response) {
                self.images = response.data;
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

                axios
                    .post("/upload", formData)
                    .then(function (response) {
                        console.log("response from POST / upload: ", response);
                    })
                    .catch(function (err) {
                        console.log("err in POST /upload: ", err);
                    });
            },

            handleChange: function (e) {
                console.log("handleChange is running!!!!");
                console.log("file: ", e.target.files[0]);
                this.file = e.target.files[0];
            },
        },
    });
})();

// console.log("sanity check");

// new Vue({
//     el: "#main",
//     data: {
//         name: "Pimento",
//         seen: true,
//         cities: [
//             // {
//             //     name: "Berlin",
//             //     country: "Germany",
//             // },
//             // {
//             //     name: "Warsaw",
//             //     country: "Poland",
//             // },
//         ],
//     },
//     mounted: function () {
//         console.log("mounted");
//         console.log("this.name", this.name);
//         console.log("this.cities", this.cities);
//         // this.cities = [
//         //     { name: "Berlin", country: "Germany" },
//         //     { name: "Warsaw", country: "Poland" },
//         // ];

//         //axios is e library for makin db requests
//         var self = this; // self used instead of this

//         axios.get("/cities").then(function (response) {
//             console.log("response: ", response);
//             console.log("self: ", self);
//             console.log("this.cities inside then: ", this.cities);
//             console.log("this inside then: ", this);

//             // this.cities = response.date;
//             // this inside then (nested fn) refers to global object so it has to be stored in var
//             self.cities = response.data;
//         });
//     },

//     methods: {
//         myFancyMethod: function (cityName) {
//             console.log("clicked", cityName);
//         },
//     },
// });
