/* eslint-disable no-template-curly-in-string */
import React from 'react'; 


const Rank = ({name,entries}) => { 
    return(
      <div>
          <div className='white f1'>
            {`Hi ${name} your current entry count is..`}
          </div>
          <div className='white f3'>
            {entries}
          </div>   
       </div>
    );
}

export default  Rank;