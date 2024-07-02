import React, { useEffect, useState, useRef } from "react";

import { Keyboard, Pagination, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Movie } from "../index";
import MovieNoScroll from "../Movie/MovieNoScroll";
import MoreItem from "../Movie/MoreItem";

function MovieListNoScroll({
  movies,
  numberOfMovies,
  excludeFirst,
  movieFocused,
  row,
}) {
  const myRef = useRef();
  const itemExist = movies.length > 0 ? true : false;

  const [curentMovie, setCurentMovie] = useState(null);

  const movieFocusSet = (movie) => {
    setCurentMovie(movie);
    movieFocused(movie);
  };

  // useEffect(() => {
  //   setFocus();
  // }, []);

  // const handleScrolling = ({ node }) => {
  //   node.scrollIntoView({behavior: "smooth", block: "center" });
  // };

  return (
    <div>
      {/* // <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            //   <List component={Stack} direction="row">
            //     <ListItem disablePadding>
            //     {movies.slice(0,4).map((movie, i) => (
            //           <Movie key={i} movie={movie} i={i} />
            //         ))}
            //     </ListItem>
            //   </List>
            // </Box> */}
      {itemExist ? (
        <Swiper
          slidesPerView={8}
          spaceBetween={35}
          className="swiper"
          modules={[Keyboard, Pagination, Navigation]}
          keyboard={{
            enabled: true,
          }}
        >
          {movies.slice(0, 7).map((movie, i) => (
            <SwiperSlide className="swiper-slide" key={i}>
              <MovieNoScroll movie={movie} movieFocus={movieFocusSet} />
            </SwiperSlide>
          ))}

          <SwiperSlide>
            <MoreItem tag_id={row} />
          </SwiperSlide>
        </Swiper>
      ) : (
        ""
      )}
    </div>
  );
}

export default MovieListNoScroll;
// const FocusableMovieList = withFocusable({
//   //trackChildren: true,
//   forgetLastFocusedChild: true
// })(MovieList);
// export default FocusableMovieList;
