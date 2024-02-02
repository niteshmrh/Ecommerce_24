import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"
import { useLatestProductQuery } from "../redux/api/productAPI";
import { toast } from "react-hot-toast";
import { Skeleton } from "../components/loader";

const Home = () => {
  const {data, isLoading, isError} = useLatestProductQuery("");
  const addtoCartHandler = () =>{};
  if(isError){
    toast.error("Cannot Fetch the Product!!!");
  }
  return (
    <div className="home">

      <section></section>
      
      <h1>Latest Product
        <Link className="findmore" to={"/search"}>More</Link>
      </h1>
      
      <main>
        {isLoading ? <Skeleton width="80vw" /> : data?.result.map((item) =>(
          <ProductCard 
            key={item._id}
            productId={item._id} 
            name={item.name} 
            price={item.price} 
            stock={item.stock} 
            handler={addtoCartHandler}
            photo={item.photo}
          />
        ))}
      </main>
    
    </div>
  )
}

export default Home