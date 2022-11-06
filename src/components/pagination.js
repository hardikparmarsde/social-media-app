import React, { useEffect, useMemo, useState } from 'react';
import ReactPaginate from 'react-paginate';
import Posts from './Posts/Posts';

const PaginatedItems = ({setCurrentId, items, itemsPerPage, currentItems, setItemOffset}) => {

  useEffect(() => {
    setCurrentId('');
  },[])

  const pageCount = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage)
  }, [items.length])


  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    setItemOffset(newOffset);
  };

  return (
    <div className='space-y-5'>
      <div className='md:ml-5 md:mr-5'>
          <Posts setCurrentId={setCurrentId} posts={currentItems}/>
      </div>
      <div>
          <ReactPaginate
            breakLabel="..."
            nextLabel={
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle-fill" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
              </svg>
            }
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel= {
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left-circle-fill" viewBox="0 0 16 16">
                <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm3.5 7.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"/>
              </svg>
            }
            renderOnZeroPageCount={null}
            className="flex text-red-500 items-center space-x-2 font-bold justify-center"
          />
      </div>
    </div>
  );
}

export default PaginatedItems;