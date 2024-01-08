import { Link } from "react-router-dom"
import ProductCard from "../components/product-card"

const Home = () => {
  const addtoCartHandler = () =>{};
  return (
    <div className="home">

      <section></section>
      
      <h1>Latest Product
        <Link className="findmore" to={"/search"}>More</Link>
      </h1>
      
      <main>
        <ProductCard 
              productId="abc" 
              name="Mackbook" 
              price={4545} 
              stock={5} 
              handler={addtoCartHandler}
              photo="	https://m.media-amazon.com/images/W/MEDIAX_792452-T1/images/I/71TPda7cwUL._SX679_.jpg"
        />
      </main>
    
    </div>
  )
}

export default Home