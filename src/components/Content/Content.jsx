import React, { useState, useEffect, useReducer } from "react";
import Badge from "../Badge/Badge";
import gradiant from "../../assets/images/Rectangle.svg";
import testLogo from "../../assets/genres/testlogo.svg";
import calender from "../../assets/images/calender-green.svg";

const Content = ({ data, curretFocusedMovie, type }) => {
  useEffect(() => {
    // movieSet();
    console.log(curretFocusedMovie);
  }, [curretFocusedMovie]);
  if (curretFocusedMovie === null || !curretFocusedMovie?.cover)
    return (
      <div className="content">
        <div className="gradiant"></div>
        {/* <img className="content-poster" src={data[0].movies.data[0]?.cover} /> */}
        {/* <div className="content-text">
          <h1 className="u700">{data[0].movies.data[0]?.movie_title}</h1>
          <Badge movie={data[0].movies.data[0]} />
          <p className="u400">{data[0].movies.data[0]?.descr?.slice(0, 200)}</p> */}
        {/* {curretFocusedMovie?.serial.enable === true ? (
          <div className="calender">
            <img src={calender} />
            <span className="u500">{curretFocusedMovie?.serial.season_id}</span>
            <span className="u500">فصل،</span>
            <span className="u500">
              {curretFocusedMovie?.serial.serial_part}
            </span>
            <span className="u500">قسمت</span>
          </div>
        ) : null} */}
        {/* </div> */}
      </div>
    );

  // if(data.data.output_type==="movie"){
  //   return (
  //             <div   className='content'>
  //                     <div className='gradiant'></div>
  //                     <img  className='content-poster' src={curretFocusedMovie ?  curretFocusedMovie?.pic.movie_img_b : data.data[0].movies.data[0].pic.movie_img_b} />
  //                     <div  className='content-text'>

  //                       <h1 className='u700' >{ curretFocusedMovie ? curretFocusedMovie?.movie_title : data.data[0].movies.data[0]?.movie_title }</h1>
  //                       <Badge  movie={curretFocusedMovie ? curretFocusedMovie : data.data[0].movies.data[0] } />
  //                       <p className='u400'>{curretFocusedMovie ? curretFocusedMovie?.descr.slice(0,200) : data.data[0].movies.data[0]?.descr.slice(0,200)}...</p>
  //                       {curretFocusedMovie?.serial.enable===true ?

  //                         <div className='calender' >
  //                           <img src={calender} />
  //                           <span className='u500'>{curretFocusedMovie?.serial.season_id}</span>
  //                           <span className='u500'>فصل،</span>
  //                           <span className='u500'>{curretFocusedMovie?.serial.serial_part}</span>
  //                           <span className='u500'>قسمت</span>
  //                         </div>
  //                         : null
  //                       }
  //                     </div>
  //             </div>
  //           )
  // }

  return (
    <div className="content">
      <div className="gradiant"></div>
      <img
        className="content-poster"
        src={curretFocusedMovie?.cover_data?.horizontal}
      />
      <div className="content-text">
        <h1 className="u700">{curretFocusedMovie?.movie_title}</h1>
        <Badge movie={curretFocusedMovie} />
        <p className="u400">
          {curretFocusedMovie?.descr?.slice(0, 200)}{" "}
          {curretFocusedMovie?.descr?.length >= 200 ? "..." : null}
        </p>
        {curretFocusedMovie?.serial.enable === true ? (
          <>
            {curretFocusedMovie?.serial.season_id !== "0" ? (
              <div className="calender">
                <img src={calender} />
                <span className="u500">
                  {curretFocusedMovie?.serial.season_id}
                </span>
                <span className="u500">فصل،</span>
                <span className="u500">
                  {curretFocusedMovie?.serial.serial_part}
                </span>
                <span className="u500">قسمت</span>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );

  // if (type === "movie") {
  //   return (
  //     <div className="content">
  //       <div className="gradiant"></div>
  //       <img
  //         className="content-poster"
  //         src={
  //           curretFocusedMovie
  //             ? curretFocusedMovie?.pic.movie_img_b
  //             : data[0].movies.data[0].pic.movie_img_b
  //         }
  //       />
  //       <div className="content-text">
  //         <h1 className="u700">
  //           {curretFocusedMovie
  //             ? curretFocusedMovie?.movie_title
  //             : data[0].movies.data[0]?.movie_title}
  //         </h1>
  //         <Badge
  //           movie={
  //             curretFocusedMovie ? curretFocusedMovie : data[0].movies.data[0]
  //           }
  //         />
  //         <p className="u400">
  //           {curretFocusedMovie
  //             ? curretFocusedMovie?.descr?.slice(0, 200)
  //             : data[0].movies.data[0]?.descr?.slice(0, 200)}
  //           ...
  //         </p>
  //         {curretFocusedMovie?.serial.enable === true &&
  //         curretFocusedMovie?.serial.season_id !== "0" ? (
  //           <div className="calender">
  //             <img src={calender} />
  //             <span>{curretFocusedMovie?.serial.season_id}</span>
  //             <span>فصل،</span>
  //             <span>{curretFocusedMovie?.serial.serial_part}</span>
  //             <span>قسمت</span>
  //           </div>
  //         ) : null}
  //       </div>
  //     </div>
  //   );
  // }

  // if (type === "series") {
  //   return (
  //     <div className="content">
  //       <div className="gradiant"></div>
  //       <img
  //         className="content-poster"
  //         src={
  //           curretFocusedMovie
  //             ? curretFocusedMovie?.pic.movie_img_b
  //             : data[2].movies.data[0].pic.movie_img_b
  //         }
  //       />
  //       <div className="content-text">
  //         <h1 className="u700">
  //           {curretFocusedMovie
  //             ? curretFocusedMovie?.movie_title
  //             : data[0].movies.data[0]?.movie_title}
  //         </h1>
  //         <Badge
  //           movie={
  //             curretFocusedMovie ? curretFocusedMovie : data[0].movies.data[0]
  //           }
  //         />
  //         <p className="u400">
  //           {curretFocusedMovie
  //             ? curretFocusedMovie?.descr?.slice(0, 200)
  //             : data[0].movies.data[0]?.descr?.slice(0, 200)}
  //           ...
  //         </p>
  //         {curretFocusedMovie?.serial.enable === true &&
  //         curretFocusedMovie?.serial.season_id !== "0" ? (
  //           <div className="calender">
  //             <img src={calender} />
  //             <span>{curretFocusedMovie?.serial.season_id}</span>
  //             <span>فصل،</span>
  //             <span>{curretFocusedMovie?.serial.serial_part}</span>
  //             <span>قسمت</span>
  //           </div>
  //         ) : null}
  //       </div>
  //     </div>
  //   );
  // }

  // if (type === "iran") {
  //   return (
  //     <div className="content">
  //       <div className="gradiant"></div>
  //       <img
  //         className="content-poster"
  //         src={
  //           curretFocusedMovie
  //             ? curretFocusedMovie?.pic.movie_img_b
  //             : data[0].movies.data[0].pic.movie_img_b
  //         }
  //       />
  //       <div className="content-text">
  //         <h1 className="u700">
  //           {curretFocusedMovie
  //             ? curretFocusedMovie?.movie_title
  //             : data[0].movies.data[0]?.movie_title}
  //         </h1>
  //         <Badge
  //           movie={
  //             curretFocusedMovie ? curretFocusedMovie : data[0].movies.data[0]
  //           }
  //         />
  //         {/* <p>{curretFocusedMovie ? curretFocusedMovie?.descr.slice(0,200) : data.data[3].movies.data[0]?.descr.slice(0,200)}...</p> */}
  //       </div>
  //     </div>
  //   );
  // }
  // if (type === "under_12") {
  //   return (
  //     <div className="content">
  //       <div className="gradiant"></div>
  //       <img
  //         className="content-poster"
  //         src={
  //           curretFocusedMovie
  //             ? curretFocusedMovie?.pic.movie_img_b
  //             : data[0].movies.data[0].pic.movie_img_b
  //         }
  //       />
  //       <div className="content-text">
  //         <h1 className="u700">
  //           {curretFocusedMovie
  //             ? curretFocusedMovie?.movie_title
  //             : data[0].movies.data[0]?.movie_title}
  //         </h1>
  //         <Badge
  //           movie={
  //             curretFocusedMovie ? curretFocusedMovie : data[0].movies.data[0]
  //           }
  //         />
  //         {/* <p>{curretFocusedMovie ? curretFocusedMovie?.descr.slice(0,200) : data.data[1].movies.data[0]?.descr.slice(0,200)}...</p> */}
  //         {curretFocusedMovie?.serial.enable === true &&
  //         curretFocusedMovie?.serial.season_id !== "0" ? (
  //           <div className="calender">
  //             <img src={calender} />
  //             <span>{curretFocusedMovie?.serial.season_id}</span>
  //             <span>فصل،</span>
  //             <span>{curretFocusedMovie?.serial.serial_part}</span>
  //             <span>قسمت</span>
  //           </div>
  //         ) : null}
  //       </div>
  //     </div>
  //   );
  // }
  // if (
  //   type === "america" ||
  //   type === "japan" ||
  //   type === "england" ||
  //   type === "s_korea" ||
  //   type === "turkey"
  // ) {
  //   return (
  //     <div className="content">
  //       <div className="gradiant"></div>
  //       <img
  //         className="content-poster"
  //         src={
  //           curretFocusedMovie
  //             ? curretFocusedMovie?.pic.movie_img_b
  //             : data[0].movies.data[0].pic.movie_img_b
  //         }
  //       />
  //       <div className="content-text">
  //         <h1 className="u700">
  //           {curretFocusedMovie
  //             ? curretFocusedMovie?.movie_title
  //             : data[0].movies.data[0]?.movie_title}
  //         </h1>
  //         <Badge
  //           movie={
  //             curretFocusedMovie ? curretFocusedMovie : data[0].movies.data[0]
  //           }
  //         />
  //         <p className="u400">
  //           {curretFocusedMovie
  //             ? curretFocusedMovie?.descr?.slice(0, 200)
  //             : data[0].movies.data[0]?.descr?.slice(0, 200)}
  //           ...
  //         </p>
  //         {curretFocusedMovie?.serial.enable === true ? (
  //           <div className="calender">
  //             <img src={calender} />
  //             <span>{curretFocusedMovie?.serial.season_id}</span>
  //             <span>فصل،</span>
  //             <span>{curretFocusedMovie?.serial.serial_part}</span>
  //             <span>قسمت</span>
  //           </div>
  //         ) : null}
  //       </div>
  //     </div>
  //   );
  // }
};

export default Content;
