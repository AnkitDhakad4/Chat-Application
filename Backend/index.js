import ENV from './src/ENV.js'
import './src/app.js'
import connection from './src/Database/connection.js'
import { server } from './src/socket.js'

const PORT=process.env.PORT || 5000


connection()
.then((res)=>{
    server.listen(PORT,()=>{
        console.log("mongoDB is connected successfully",res.connection.host)
        console.log(`app is working on port https://localhost:${PORT}`)
    })
})
.catch((err)=>{
    console.log("Error while connectin to the mongoDB:- ",err.message)
})


