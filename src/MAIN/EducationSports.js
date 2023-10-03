import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { useParams } from "react-router";
import '../css/style.css'
import '../css/li-scroller.css'
import '../css/slick.css'
function EducationSports({ agencyDetails, page_name }) {
    const [data, setData] = useState([]);
    const [fetch, setFetch] = useState(false);
    const navigate = useNavigate();

    const [categories, setCategory] = useState();

    const getCategoryName = (url) => {
        for (let i = 0; i < categories.length; i++) {
            if (categories[i].categories_Name_Url === url) {
                return categories[i].categories_Name_Hindi;
            }
        }
    };

    const getData = async (categories) => {
        try {
            console.log(agencyDetails._id, categories)
            const promises = categories.map((category) =>
                axios.get(
                    `http://174.138.101.222:8080/${agencyDetails._id}/get-Postnews/${category}`
                )
            );

            const responses = await Promise.all(promises);

            const newData = responses.map((response, index) => ({
                category: categories[index],
                data: response.data.data,
            }));

            setData((prevData) => [...prevData, ...newData]);
            setFetch(true);

            // console.log("data fetched");
        } catch (error) {
            console.log(error);
        }
    };

    const [input, setInput] = useState([]);
    const getCategories = async () => {
        try {
            const response = await axios.get(
                "http://174.138.101.222:8080/getmastercategories"
            );
            // console.log(response.data.data, "categories");
            setCategory(response.data.data);

            response.data.data.map((item) => {
                setInput((prev) => [...prev, item.categories_Name_Url]);
            });
        } catch (error) {
            console.log(error);
        }
    };
    // console.log(input, "input");
    useEffect(() => {
        getCategories();
        getData(input);
    }, [categories?.length]);

    // console.log(data);

    function formatDate(inputDate) {
        // Step 1: Parse the input string into a JavaScript Date object
        const dateObj = new Date(inputDate);

        // Step 2: Extract day, month, and year from the Date object
        const day = dateObj.getUTCDate();
        const month = dateObj.toLocaleString("default", { month: "long" });
        const year = dateObj.getUTCFullYear();

        // Step 3: Format the values into "day month year" format
        const formattedDate = `${day} ${month} ${year}`;
        return formattedDate;
    }
    const getCurrentPageURL = window.location.href;
    const { id } = useParams();

    const [breakingNews, setBreakingNews] = useState();
    const fetchBreakingNews = async () => {
        try {
            const response = await axios.get(
                `http://174.138.101.222:8080/${id}/getBreakingNews`
            );
            // console.log(response.data.data, "breaking");
            setBreakingNews(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchBreakingNews();
    }, []);

    const [ad, setAd] = useState();

    const fetchAd = async () => {
        try {
            const response = await axios.get(`http://174.138.101.222:8080/${agencyDetails._id}/${page_name}/Footer/get-Advertisement`)
            console.log(response.data.data[0], page_name)
            setAd(response.data.data[0])
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        fetchAd();
    }, [agencyDetails, page_name])
    return (
        <div className='row'>
            <div className='col-sm-8 Margin-left-class' >
                {fetch &&
                    data.map((item, index) => {
                        return (
                            <div key={index} >
                                <div className="latest_post">
                                    {item.data.length > 0 && (
                                        <h2 className="m-0" >
                                            <Link
                                                style={{ color: "white" }}
                                                to={`/${agencyDetails._id}/Category/${item.category}`}
                                            >
                                                {getCategoryName(item.category)}
                                            </Link>
                                        </h2>
                                    )}
                                </div>

                                <div className="row" style={{ marginLeft: "56px" }}>
                                    {item.data
                                        .reverse()
                                        .slice(0, 2)
                                        .map((news, index) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="position-relative col-sm-12 col-md-6 hight-remove padding-remover"
                                                
                                                    onClick={() => {
                                                        // console.log("Img clicked");
                                                        navigate(
                                                            `/${agencyDetails._id}/DetailedNews/${news._id}`,
                                                            {
                                                                state: {
                                                                    item: news,
                                                                    agencyDetails: agencyDetails,
                                                                },
                                                            }
                                                        );
                                                    }}
                                                >
                                                    <img
                                                        className="img-fluid"
                                                        // src={news.image}
                                                        src={`http://174.138.101.222:8080${news.image}`}
                                                        style={{
                                                            // objectFit: "cover",
                                                            // height: "100%",
                                                            width: "85%",


                                                        }}
                                                    />
                                                    <div
                                                        className=" main-paragraph-d"
                                                        style={{
                                                            padding: "12px 0px",
                                                            height: "20%"
                                                        }}
                                                    >
                                                        <div className="mb-2" style={{ fontSize: 13 }}>

                                                            <span>{formatDate(news.updatedAt)}</span>
                                                        </div>
                                                        <p className=" m-0 set-width-contain" href="">
                                                            {news.title}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        );
                    })}
            </div>
            <div  className='col-sm-3 set-width'>
                <div className="pb-3">
                    <div className="latest_post" style={{ display: "contents" }}>
                        <h2 className="m-0"><a href="">TRENDING</a></h2>
                    </div>

                    {breakingNews &&
                        breakingNews.map((news, index) => {
                            return (

                                <div key={index} className=" mb-3" >

                                    <div style={{ display: "flex", marginTop: "5px" }}>
                                        <div className="div1">
                                            <img
                                                src={
                                                    news.image
                                                        ? `http://174.138.101.222:8080${news.image}`
                                                        : `https://www.newsclick.in/sites/default/files/2018-09/xfakenews_0.jpg.pagespeed.ic_.232PSP6q2x_0.jpg`
                                                }
                                                style={{
                                                    width: 100,
                                                    height: 100,
                                                    objectFit: "fill",
                                                }}
                                            />
                                        </div>
                                        <div className="div2" style={{ paddingLeft: "12px", paddingTop: "10px" }}>
                                            <div
                                                className="w-100 d-flex flex-column justify-content-center bg-light px-3"
                                                style={{ height: 100 }}
                                            >
                                                <div className="mb-1" style={{ fontSize: 13 }}>
                                                    <p
                                                        className="mb-0"
                                                        style={{ display: "inline" }}
                                                        href=""
                                                    >
                                                        {news.category}
                                                    </p>
                                                    <span className="px-1">/</span>
                                                    <span>{formatDate(news.updatedAt)}</span>
                                                </div>
                                                <Link
                                                    to={`/${id}/DetailedNews/${news._id}`}
                                                    className="h6 m-0"
                                                >
                                                    {news.title}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            );
                        })}
                </div>
                <div className="pb-3">
                    <div className="latest_post">
                        <h2 className="m-0"><a href="">SPONSOR</a></h2>
                    </div>
                    {
                        ad?.script.length > 0 && <p className="mb-0" style={{ border: '1px solid black', width: '100%', height: '350px', overflow: 'hidden' }}>{ad?.script}</p>
                    }
                    {
                        ad?.text.length > 0 && <p className="mb-0" style={{ border: '1px solid black', width: '100%', height: '350px', overflow: 'hidden' }}>{ad?.text}</p>
                    }
                    {
                        ad?.image.length > 0 && <img style={{ width: '100%', height: '100%', maxHeight: "350px" }} src={`http://174.138.101.222:8080${ad?.image}`} />
                    }
                </div>
                {/* <div className="pb-3">
                    <div className="latest_post">
                        <h2 className="m-0"><a href="">LINKS </a></h2>
                    </div>
                    <div className="row" style={{ marginTop: '40px' }}>
                        <div className="col-sm-6 ">
                            <a href="#" className="icon" style={{ backgroundColor: "rgb(57, 86, 158)", padding: "0.7rem 1.9rem", marginLeft: '10px' }}>
                                <small class="fa-brands fa-facebook" style={{ color: "white", fontSize: "19px" }}></small>
                                <a style={{ color: "white", fontSize: "12px", marginLeft: "8px", textDecoration: "none" }} >12,456 fans</a>
                            </a>
                        </div>
                        <div className="col-sm-6">
                            <a href="#" className="icon" style={{ backgroundColor: "rgb(82, 170, 244)", padding: "0.7rem 1.9rem", marginLeft: '10px' }}>
                                <small class="fa-brands fa-twitter" style={{ color: "white", fontSize: "19px" }} ></small>
                                <a style={{ color: "white", fontSize: "12px", marginLeft: "8px", textDecoration: "none" }} >12,456 fans</a>
                            </a>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: '40px' }}>
                        <div className="col-sm-6 ">
                            <a href="#" className="icon" style={{ backgroundColor: "rgb(1, 133, 174)", padding: "0.7rem 1.9rem", marginLeft: '10px' }}>
                                <small class="fa-brands fa-linkedin-in" style={{ color: "white", fontSize: "19px" }} ></small>
                                <a style={{ color: "white", fontSize: "12px", marginLeft: "8px", textDecoration: "none" }} >12,456 fans</a>
                            </a>
                        </div>
                        <div className="col-sm-6">
                            <a href="#" className="icon" style={{ backgroundColor: "rgb(200, 53, 157", padding: "0.7rem 1.9rem", marginLeft: '10px' }}>
                                <small class="fa-brands fa-instagram" style={{ color: "white", fontSize: "19px" }} ></small>
                                <a style={{ color: "white", fontSize: "12px", marginLeft: "8px", textDecoration: "none" }} >12,456 fans</a>
                            </a>
                        </div>
                    </div>
                    <div className="row" style={{ marginTop: '40px' }}>
                        <div className="col-sm-6 ">
                            <a href="#" className="icon" style={{ backgroundColor: "rgb(220, 71, 46)", padding: "0.7rem 1.9rem", marginLeft: '10px' }}>
                                <small class="fa-brands fa-youtube" style={{ color: "white", fontSize: "19px" }} ></small>
                                <a style={{ color: "white", fontSize: "12px", marginLeft: "8px", textDecoration: "none" }} >12,456 fans</a>
                            </a>
                        </div>
                        <div className="col-sm-6">
                            <a href="#" className="icon" style={{ backgroundColor: "rgb(26, 183, 234)", padding: "0.7rem 1.9rem", marginLeft: '10px' }}>
                                <small class="fa-solid fa-v" style={{ color: "white", fontSize: "19px" }} ></small>
                                <a style={{ color: "white", fontSize: "12px", marginLeft: "8px", textDecoration: "none" }} >12,456 fans</a>
                            </a>
                        </div>
                    </div>
                </div> */}
                <div className="pb-3">
                    <div className="latest_post">
                        <h2 className="m-0"><a href="">LINKS</a></h2>
                    </div>
                    <div className="row icons-set" style={{ marginTop: '40px' }}>
                        <div className="col-md-6">
                            <a href="#" className="icon" style={{ backgroundColor: "rgb(57, 86, 158)", padding: "0.7rem 1.9rem", margin: '10px' }}>
                                <small class="fa-brands fa-facebook" style={{ color: "white", fontSize: "19px" }}></small>
                                <a style={{ color: "white", fontSize: "12px", marginLeft: "8px", textDecoration: "none" }} >12,456 fans</a>
                            </a>
                        </div>
                        <div className="col-md-6">
                            <a href="#" className="icon" style={{ backgroundColor: "rgb(82, 170, 244)", padding: "0.7rem 1.9rem", margin: '10px' }}>
                                <small class="fa-brands fa-twitter" style={{ color: "white", fontSize: "19px" }} ></small>
                                <a style={{ color: "white", fontSize: "12px", marginLeft: "8px", textDecoration: "none" }} >12,456 fans</a>
                            </a>
                        </div>
                    </div>
                    <div className="row icons-set" style={{ marginTop: '40px' }}>
                        <div className="col-md-6">
                            <a href="#" className="icon" style={{ backgroundColor: "rgb(1, 133, 174)", padding: "0.7rem 1.9rem", margin: '10px' }}>
                                <small class="fa-brands fa-linkedin-in" style={{ color: "white", fontSize: "19px" }} ></small>
                                <a style={{ color: "white", fontSize: "12px", marginLeft: "8px", textDecoration: "none" }} >12,456 fans</a>
                            </a>
                        </div>
                        <div className="col-md-6">
                            <a href="#" className="icon" style={{ backgroundColor: "rgb(200, 53, 157", padding: "0.7rem 1.9rem", margin: '10px' }}>
                                <small class="fa-brands fa-instagram" style={{ color: "white", fontSize: "19px" }} ></small>
                                <a style={{ color: "white", fontSize: "12px", marginLeft: "8px", textDecoration: "none" }} >12,456 fans</a>
                            </a>
                        </div>
                    </div>
                    <div className="row icons-set" style={{ marginTop: '40px' }}>
                        <div className="col-md-6">
                            <a href="#" className="icon" style={{ backgroundColor: "rgb(220, 71, 46)", padding: "0.7rem 1.9rem", margin: '10px' }}>
                                <small class="fa-brands fa-youtube" style={{ color: "white", fontSize: "19px" }} ></small>
                                <a style={{ color: "white", fontSize: "12px", marginLeft: "8px", textDecoration: "none" }} >12,456 fans</a>
                            </a>
                        </div>
                        <div className="col-md-6">
                            <a href="#" className="icon" style={{ backgroundColor: "rgb(26, 183, 234)", padding: "0.7rem 1.9rem", margin: '10px' }}>
                                <small class="fa-solid fa-v" style={{ color: "white", fontSize: "19px" }} ></small>
                                <a style={{ color: "white", fontSize: "12px", marginLeft: "8px", textDecoration: "none" }} >12,456 fans</a>
                            </a>
                        </div>
                    </div>
                </div>

            </div>
        </div >


    )
}

export default EducationSports