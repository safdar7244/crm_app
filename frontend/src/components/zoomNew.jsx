import Zoom from './Zoom'
import react from 'react'



function zoomNew (props)




{
    document.getElementById('navvbar').style.display="none"

    console.log("hello")
    return(
        <div>
         <Zoom _id={ props.location.state._id} _pass={ props.location.state._pass}  number= { props.location.state.number} />
        </div>
    );
}


export default zoomNew