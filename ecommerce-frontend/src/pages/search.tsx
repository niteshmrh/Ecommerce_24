import { useState } from "react"
import ProductCard from "../components/product-card";

const Search = () => {
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [maxPrice, setMaxprice] = useState(100000);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);

  const addtoCartHandler = ()=>{};

  const isPrevPage = page > 1;
  const isNextPage = page < 4;

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
            <option value="camera">Camera</option>
            <option value="laptop">Laptop</option>
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
        <div className="search-product-list">
          <ProductCard 
            productId="abc" 
            name="Mackbook" 
            price={4545} 
            stock={5} 
            handler={addtoCartHandler}
            photo="	https://m.media-amazon.com/images/W/MEDIAX_792452-T1/images/I/71TPda7cwUL._SX679_.jpg"
          />
        </div>
        <article>
          <button disabled={!isPrevPage} onClick={() => setPage((prev) => prev-1)}>Prev</button>
          <span>{page} of {4}</span>
          <button disabled={!isNextPage} onClick={() => setPage((prev) => prev+1)}>Next</button>
        </article>
      </main>
    </div>
  )
}

export default Search