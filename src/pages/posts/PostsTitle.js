import { useParams, useNavigate } from 'react-router-dom';

function PostsTitle() {
    const {title} = useParams();
    const navigate = useNavigate();
    const goBack = () => navigate(-1)

    return (
      <div>
        <button onClick={goBack} className="PostsTitleButton">← Back</button>
        <h2>Enter the text after the "/" sign in the search bar.</h2><br></br>
        <h3 className='PostsTitle'>{title}</h3>
      </div>
    )
}
  
export {PostsTitle};
