import { useEffect, useState } from "react";
import { Button, Pagination } from "semantic-ui-react";
import { getData, getProducts } from "../../services/api";

import CardItem from "./CardItem";
import "./cards.css";

const Cards = ({ pageDevider, setResponseInfo }) => {
  const [result, setResult] = useState([]);
  const [productsByPage, setProductsByPage] = useState([]);
  const [start, setStart] = useState(0);
  const [searchProd,setSearchProd] = useState([]);
  

  useEffect(() => {
    (async function createPageinashion() {
      let data = await getProducts();      
      setResult(data);
    })();
  }, []);

  useEffect(() => {
    setProductsByPage(result.slice(start, start + pageDevider));
  }, [start, result]);

  function goToPage(e, data) {
    // console.log(data.activePage);
    setStart(data.activePage * pageDevider - pageDevider);
  }

  function searchProduct(event){
      console.log(event);
  }
  // console.log("result", result);
  console.log("productsByPage",productsByPage);
  return (<>

    <div className="ui stackable three column grid productItems">
      {productsByPage &&
        productsByPage.length > 0 &&
        productsByPage.map((item) => {
          return (
            <CardItem
              
              item={item}
              key={item.id}
              description={item?.description.comment || ""}
              image={item.img && item.img.length>0 && item.img[0].imagePath}
              imageList={item.img} //try to add picture pagination
              name={item.name}
              price={item.price}
              currency={item.currency}
              setResponseInfo={setResponseInfo}
              stock={item.stock.count}
            />
            
          );
                })}

      <div className="pagination-container">
        {/* semantic pagination */}
        <Pagination
          defaultActivePage={1}
          secondary
          onPageChange={goToPage}
          totalPages={Math.ceil(result.length / pageDevider)}
          
        />
          {!eventSearch ? (
            <Pagination
              defaultActivePage={1}
              secondary
              onPageChange={goToPage}
              totalPages={Math.ceil(result.length / pageDevider)}
              // totalPages={numberPage.current}
            />
          ) : (
            ""
          )}
      
      </div>  
    </div>
    </>
  );
};

export default Cards;
