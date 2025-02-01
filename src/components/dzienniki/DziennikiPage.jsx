import { Link } from 'react-router-dom';


function DziennikiPage() {
  return (
    <div>
      <h2>Dzienniki</h2>
      <ul>
        <li><Link to="/dzienniki/asystent-butelkowania">AsystentButelkowania.jsx</Link></li>
        <li><Link to="/dzienniki/asystent-warzenia">AsystentWarzenia.jsx</Link></li>
      </ul>
    </div>
  );
}


export default DziennikiPage;