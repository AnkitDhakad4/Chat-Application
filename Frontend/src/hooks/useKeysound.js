

const sound={
    s1:new Audio('/sounds/keystroke1.mp3'),
    s2:new Audio('/sounds/keystroke2.mp3'),
    s3:new Audio('/sounds/keystroke3.mp3'),
    s4:new Audio('/sounds/keystroke4.mp3')
}



const useKeysound=()=>{

    function playSound(){

        let rndm=Math.floor(Math.random()*4+1)
        let key=`s${rndm}`
        // console.log(key)
        const curr=sound[key]
        curr.currentTime=0
        curr.play().catch((e)=>{console.log("Error while playing the sound ",error)})
    }

    return {playSound}
}


export default useKeysound