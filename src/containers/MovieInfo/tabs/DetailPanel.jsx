import React, { useImperativeHandle, forwardRef } from "react";
import { setFocus } from "@noriginmedia/norigin-spatial-navigation";
import { useGetMovieDetailQuery } from "@src/services/TMDB";
import Actors from "@src/components/Actors/Actors";
import Crews from "@src/components/Crews/Crews";
import Loader from "@src/components/Loader/Loader";
import NetworkError from "@src/components/NetworkError/NetworkError";
import { stripHtmlTags } from "@src/utils";

const toFarsi = (value) =>
  String(value ?? "").replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const DetailPanel = forwardRef(({ id, general }, ref) => {
  const {
    data: movieDetail,
    error,
    isFetching,
  } = useGetMovieDetailQuery({ id });

  const hasActors = !!movieDetail?.data?.ActorCrewData;
  const hasCrew = !!movieDetail?.data?.OtherCrewData;

  useImperativeHandle(ref, () => ({
    focusFirst: () => setFocus(hasActors ? "Actor__0" : "Crew__0"),
  }));

  if (isFetching) return <Loader />;
  if (error) return <NetworkError errorText="دیتایی یافت نشد" />;

  const story = stripHtmlTags(general?.about_movie || general?.descr || "");
  const serial = general?.serial;

  const specs = [];
  if (general?.categories?.length)
    specs.push({
      label: "ژانر",
      value: general.categories.map((c) => c.title).join("، "),
    });
  if (general?.subtitle)
    specs.push({
      label: "زیرنویس",
      value: general.subtitle.enable ? general.subtitle.text : "ندارد",
    });
  if (general?.dubbed)
    specs.push({
      label: "دوبله",
      value: general.dubbed.enable ? general.dubbed.text : "ندارد",
    });
  if (general?.age_range && general.age_range !== "all")
    specs.push({ label: "رده سنی", value: toFarsi(general.age_range) });
  if (general?.countries?.length)
    specs.push({
      label: "محصول",
      value:
        general.countries.map((c) => c.title).join("، ") +
        (general?.pro_year ? " " + toFarsi(general.pro_year) : ""),
    });
  if (serial?.enable && serial?.schedule?.text)
    specs.push({ label: "روز پخش", value: serial.schedule.text });
  if (serial?.enable && serial?.season_id)
    specs.push({
      label: "تعداد فصل و قسمت",
      value: `${toFarsi(serial.season_id)} فصل و ${toFarsi(serial.serial_part)} قسمت`,
    });

  return (
    <div className="movieinfo-detail-panel">
      {hasActors && (
        <Actors actorsRow={movieDetail.data.ActorCrewData.profile} />
      )}
      {hasCrew && <Crews crewRow={movieDetail.data.OtherCrewData} />}

      {story && (
        <section className="movieinfo-detail-story">
          <h3 className="u700">{serial?.enable ? "داستان سریال" : "داستان"}</h3>
          <p className="u500">{story}</p>
        </section>
      )}

      {/* {specs.length > 0 && (
        <section className="movieinfo-detail-specs">
          {specs.map((spec) => (
            <div className="movieinfo-spec" key={spec.label}>
              <span className="movieinfo-spec-label u500">{spec.label}</span>
              <span className="movieinfo-spec-value u700">{spec.value}</span>
            </div>
          ))}
        </section>
      )} */}

      {!hasActors && !hasCrew && !story && specs.length === 0 && (
        <NetworkError errorText="دیتایی یافت نشد" />
      )}
    </div>
  );
});

export default DetailPanel;
