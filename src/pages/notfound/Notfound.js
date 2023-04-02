import { Link } from 'react-router-dom';

function Notfound() {
    return (
      <div>
        <h3>Sorry.. page not found. Please return to the <Link to="/">home page</Link></h3>
      </div>
    )
}
  
export {Notfound};
