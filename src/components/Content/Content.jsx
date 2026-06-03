import React, { useState, useEffect, useReducer } from "react";
import Badge from "../Badge/Badge";
import gradiant from "../../assets/images/Rectangle.svg";
import testLogo from "../../assets/genres/testlogo.svg";
import calender from "../../assets/images/calender-green.svg";

const Content = ({ data, curretFocusedMovie, type }) => {
  const convertToFarsi = (number) => {
    const farsiNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
    return String(number)
      .split("")
      .map((num) => farsiNumbers[num] || num)
      .join("");
  };
  useEffect(() => {
    // movieSet();
    // console.log(curretFocusedMovie);
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
        <h1 className="content-text-header u700">
          {curretFocusedMovie?.movie_title}
        </h1>
        <Badge movie={curretFocusedMovie} />
        <p className="content-text-p u400">
          {curretFocusedMovie?.descr?.slice(0, 200)}{" "}
          {curretFocusedMovie?.descr?.length >= 200 ? "..." : null}
        </p>
        {curretFocusedMovie?.serial.enable === true ? (
          <>
            {curretFocusedMovie?.serial.season_id !== "0" ? (
              <div className="calender">
                <svg
                  className="calender-logo"
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M20.4167 4.66671H7.58332C7.2739 4.66671 6.97716 4.54379 6.75837 4.325C6.53957 4.10621 6.41666 3.80946 6.41666 3.50004C6.41666 3.19062 6.53957 2.89388 6.75837 2.67508C6.97716 2.45629 7.2739 2.33337 7.58332 2.33337H20.4167C20.7261 2.33337 21.0228 2.45629 21.2416 2.67508C21.4604 2.89388 21.5833 3.19062 21.5833 3.50004C21.5833 3.80946 21.4604 4.10621 21.2416 4.325C21.0228 4.54379 20.7261 4.66671 20.4167 4.66671ZM21.5833 22.1667H6.41666C5.4884 22.1667 4.59816 21.798 3.94178 21.1416C3.28541 20.4852 2.91666 19.595 2.91666 18.6667V9.33337C2.91666 8.40512 3.28541 7.51488 3.94178 6.8585C4.59816 6.20212 5.4884 5.83337 6.41666 5.83337H21.5833C22.5116 5.83337 23.4018 6.20212 24.0582 6.8585C24.7146 7.51488 25.0833 8.40512 25.0833 9.33337V18.6667C25.0833 19.595 24.7146 20.4852 24.0582 21.1416C23.4018 21.798 22.5116 22.1667 21.5833 22.1667ZM5.5917 8.50842C5.37291 8.72721 5.24999 9.02396 5.24999 9.33337V18.6667C5.24999 18.9761 5.37291 19.2729 5.5917 19.4917C5.81049 19.7105 6.10724 19.8334 6.41666 19.8334H21.5833C21.8927 19.8334 22.1895 19.7105 22.4083 19.4917C22.6271 19.2729 22.75 18.9761 22.75 18.6667V9.33337C22.75 9.02396 22.6271 8.72721 22.4083 8.50842C22.1895 8.28962 21.8927 8.16671 21.5833 8.16671H6.41666C6.10724 8.16671 5.81049 8.28962 5.5917 8.50842ZM20.4167 25.6667C20.7261 25.6667 21.0228 25.5438 21.2416 25.325C21.4604 25.1062 21.5833 24.8095 21.5833 24.5C21.5833 24.1906 21.4604 23.8939 21.2416 23.6751C21.0228 23.4563 20.7261 23.3334 20.4167 23.3334H7.58332C7.2739 23.3334 6.97716 23.4563 6.75837 23.6751C6.53957 23.8939 6.41666 24.1906 6.41666 24.5C6.41666 24.8095 6.53957 25.1062 6.75837 25.325C6.97716 25.5438 7.2739 25.6667 7.58332 25.6667H20.4167ZM16.555 14.9217L12.8333 17.4184C12.6569 17.5376 12.4512 17.6063 12.2385 17.617C12.0258 17.6277 11.8143 17.58 11.6268 17.4791C11.4393 17.3781 11.283 17.2278 11.1749 17.0443C11.0667 16.8609 11.0109 16.6513 11.0133 16.4384V11.4684C11.013 11.2564 11.0704 11.0484 11.1794 10.8666C11.2884 10.6849 11.4449 10.5362 11.632 10.4367C11.8191 10.3371 12.0298 10.2904 12.2415 10.3016C12.4531 10.3127 12.6577 10.3814 12.8333 10.5L16.555 12.985C16.7138 13.0918 16.8439 13.2359 16.9339 13.4048C17.0239 13.5736 17.0709 13.762 17.0709 13.9534C17.0709 14.1447 17.0239 14.3331 16.9339 14.502C16.8439 14.6708 16.7138 14.815 16.555 14.9217Z"
                  />
                </svg>

                <span className="calender-text u500">فصل</span>
                <span className="calender-text u500">
                  {convertToFarsi(curretFocusedMovie?.serial.season_id)} ,
                </span>

                <span className="calender-text u500">قسمت</span>
                <span className="calender-text u500">
                  {convertToFarsi(curretFocusedMovie?.serial.serial_part)}
                </span>
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
