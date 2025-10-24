import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './DetailsPage.css';

export default function DetailsPage() {
    const navigate = useNavigate();
    const { productId } = useParams();
    const [gift, setGift] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

	useEffect(() => {
        const authenticationToken = sessionStorage.getItem('auth-token');
        if (!authenticationToken) {
            navigate('/app/login');
        }

        // get the gift to be rendered on the details page
        const fetchGift = async () => {
            try {
                const url = `${urlConfig.backendUrl}/api/gifts/${productId}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setGift(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGift();

		window.scrollTo(0, 0);

    }, [productId]);


    const handleBackClick = () => {
		navigate(-1);
	};

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }
    if (!gift) {
        return <div>Gift not found</div>;
    }

    return (
        <div className="container mt-5">
            <button className="btn btn-secondary mb-3" onClick={handleBackClick}>Back</button>
            <div className="card product-details-card">
                <div className="card-header text-white">
                    <h2 className="details-title">{gift.name}</h2>
                </div>
                <div className="card-body">
                    <div className="image-placeholder-large">
                        {gift.image ? (
                            <img src={gift.image} alt={gift.name} className="product-image-large" />
                        ) : (
                            <div className="no-image-available-large">No Image Available</div>
                        )}
                    </div>
                    <p><strong>Category:</strong> 
                        {gift.category}
                    </p>
                    <p><strong>Condition:</strong> 
                        {gift.condition}
                    </p>
                    <p><strong>Date Added:</strong> 
                        {gift.dateAdded}
                    </p>
                    <p><strong>Age (Years):</strong> 
                        {gift.age}
                    </p>
                    <p><strong>Description:</strong> 
                        {gift.description}
                    </p>
                </div>
            </div>
            <div className="comments-section mt-4">
                <h3 className="mb-3">Comments</h3>
                {comments.map((comment, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <p className="comment-author"><strong>{comment.author}:</strong></p>
                            <p className="comment-text">{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}