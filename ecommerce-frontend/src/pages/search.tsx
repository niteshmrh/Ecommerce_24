import { useState } from "react"
import ProductCard from "../components/product-card";
import { useCategoriesQuery, useSearchProductQuery } from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import { toast } from "react-hot-toast";
// import { server } from "../redux/store";
import { Skeleton } from "../components/loader";
import { addToCart, calculatePrice, removeCartItem } from "../redux/reducer/cartReducer";
import { CartItems } from "../types/types";
import { useDispatch } from "react-redux";

const Search = () => {
  const { data, isLoading, isError, error } = useCategoriesQuery("");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxprice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const dispatch = useDispatch();

  const {data: searchProduct, isLoading: productLoading, isError:isProductError, error: productError} = 
  useSearchProductQuery({
    search,
    sort, 
    category, 
    page, 
    price: maxPrice
  });

  const addtoCartHandler = (cartItem: CartItems) =>{
    if(cartItem.stock < 1){
      toast.error("Out of Stock");
    }
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  };

  const isPrevPage = page > 1;
  const isNextPage = page < (searchProduct?.totalPages);

  if(isError){
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  if(isProductError){
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  return (
    <div className="product-search-page">
      <aside>
        <h2>Filter</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="desc">Price(High to Low)</option>
            <option value="asc">Price(Low to High)</option>
          </select>
        </div>

        <div>
          <h4>Max Price : {maxPrice || ""}</h4>
          <input 
            type="range"
            min={100}
            max={100000}
            value={maxPrice} 
            onChange={(e) => setMaxprice(Number(e.target.value))} />
        </div>

        <div>
          <h4>Category</h4>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All</option>
            {!isLoading && data?.result.map((item: string)=>(
              <option key={item} value={item}>{item.toUpperCase()}</option>
            ))}
          </select>
        </div>

      </aside>
      <main>
        <h1>PRODUCT</h1>
        <input 
          type="text"
          placeholder="Search by name....."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        
        {productLoading ? < Skeleton length={10}/> : 
          <div className="search-product-list">
            {!productLoading && searchProduct?.success && searchProduct?.result.map((item)=>(
              <ProductCard 
                productId={item._id} 
                name={item.name} 
                price={item.price} 
                stock={item.stock} 
                handler={addtoCartHandler}
                photo={item.photo}
              />
            ))}
          </div>
        }

        {searchProduct && searchProduct?.totalPages > 1 && <article>
          <button disabled={!isPrevPage} onClick={() => setPage((prev) => prev-1)}>Prev</button>
          <span>{page} of {searchProduct?.totalPages}</span>
          <button disabled={!isNextPage} onClick={() => setPage((prev) => prev+1)}>Next</button>
        </article>}
      </main>
    </div>
  )
}

export default Search