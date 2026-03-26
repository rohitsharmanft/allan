
export const Menu = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about-us" },

    {
        label: "How It Works",
        key: "how",
        paths: ["/how-it-works"],
        children: [
            { label: "Overview", path: "/how-it-works" },
            { label: "Skills & Trades", path: "/how-it-works#skills", hash: true },
            { label: "Clients & Employers", path: "/how-it-works#clients", hash: true },
        ],
    },

    {
        label: "Member Resources",
        key: "member",
        paths: ["/login", "/member-advice-center", "/signUp-member"],
        children: [
            { label: "Sign Up", path: "/signUp-member" },
            { label: "Advice Center", path: "/member-advice-center" },
            { label: "Login", path:"/login"  },
        ],
    },

    {
        label: "Client Resources",
        key: "client",
        paths: [
            "/client-advice-center",
            "/signup",
            "/leave-review",

        ],
        children: [
            { label: "Advice Center", path: "/client-advice-center" },
            { label: "Sign Up For Reviews", path: "/signup" },
            { label: "Login For A Review", path: "/login" },
           
        ],
    },

    { label: "Jobs", path: "/job" },
    { label: "FAQs", path: "/faqs-client" },
];