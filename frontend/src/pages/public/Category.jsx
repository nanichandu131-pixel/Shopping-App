import { Navigate, useParams } from 'react-router-dom';
import SearchResults from './SearchResults.jsx';

export default function Category() {
  const { id } = useParams();

  if (id && /^[a-f\d]{24}$/i.test(id)) {
    return <Navigate to={`/search?category=${id}`} replace />;
  }

  if (id) return <Navigate to={`/search?q=${encodeURIComponent(id)}`} replace />;

  return <SearchResults />;
}
