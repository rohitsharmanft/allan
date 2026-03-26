interface login {
    email:string,
    password:string,
    language:string
}

interface DailyThought {
    title:string,
    subject:string,
    message:string,
}

export {
    login,
    DailyThought
}