import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Loading from '../components/utility/Loading';
import Alert from '../components/utility/Alert';


export default function Event() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [eventData, setEventData] = useState(null);

    const getData = async () => {

    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>

        </div>
    );
}