import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
// //Import Scrollbar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { Link, useLocation } from "react-router-dom";
import withRouter from "../Common/withRouter";

//i18n
import { withTranslation } from "react-i18next";
import { useCallback } from "react";

import HavingTroubleIcon from "../../assets/images/svg/sidebar-having-trouble.svg";
import { Button } from "@/components/ui/button";
// import { ReactComponent as HomeIcon } from "../../assets/images/svg/home-icon.svg";

const SidebarContent = (props) => {
  const ref = useRef();
  const path = useLocation();
  const isAdmin = useSelector((state) => state.login.user?.is_admin);

  const activateParentDropdown = useCallback((item) => {
    item.classList.add("active");
    const parent = item.parentElement;
    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      scrollElement(item);
      return false;
    }
    scrollElement(item);
    return false;
  }, []);

  const removeActivation = (items) => {
    for (var i = 0; i < items.length; ++i) {
      var item = items[i];
      const parent = items[i].parentElement;

      if (item && item.classList.contains("active")) {
        item.classList.remove("active");
      }
      if (parent) {
        const parent2El =
          parent.childNodes && parent.childNodes.lenght && parent.childNodes[1]
            ? parent.childNodes[1]
            : null;
        if (parent2El && parent2El.id !== "side-menu") {
          parent2El.classList.remove("mm-show");
        }

        parent.classList.remove("mm-active");
        const parent2 = parent.parentElement;

        if (parent2) {
          parent2.classList.remove("mm-show");

          const parent3 = parent2.parentElement;
          if (parent3) {
            parent3.classList.remove("mm-active"); // li
            parent3.childNodes[0].classList.remove("mm-active");

            const parent4 = parent3.parentElement; // ul
            if (parent4) {
              parent4.classList.remove("mm-show"); // ul
              const parent5 = parent4.parentElement;
              if (parent5) {
                parent5.classList.remove("mm-show"); // li
                parent5.childNodes[0].classList.remove("mm-active"); // a tag
              }
            }
          }
        }
      }
    }
  };

  const activeMenu = useCallback(() => {
    const pathName = path.pathname;
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");
    removeActivation(items);

    for (let i = 0; i < items.length; ++i) {
      if (pathName === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      activateParentDropdown(matchingMenuItem);
    }
  }, [path.pathname, activateParentDropdown]);

  useEffect(() => {
    ref.current.recalculate();
  }, []);

  useEffect(() => {
    new MetisMenu("#side-menu");
    activeMenu();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    activeMenu();
  }, [activeMenu]);

  function scrollElement(item) {
    if (item) {
      const currentPosition = item.offsetTop;
      if (currentPosition > window.innerHeight) {
        ref.current.getScrollElement().scrollTop = currentPosition - 300;
      }
    }
  }

  return (
    <div className="h-100 w-[269px] overflow-y-auto flex flex-col">
      <SimpleBar className="h-100 " ref={ref}>
        <div id="sidebar-menu">
          <ul
            className="metismenu list-unstyled space-y-6 pt-20"
            id="side-menu"
          >
            {/* <li className="menu-title">{props.t("Menu")} </li> */}

            <li>
              <Link to="/home" className="">
                <i>
                <svg
                    width={14}
                    height={15}
                    viewBox="0 0 14 15"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 8.7475H6.22222V0.969727H0V8.7475ZM0 14.9697H6.22222V10.3031H0V14.9697ZM7.77778 14.9697H14V7.19195H7.77778V14.9697ZM7.77778 0.969727V5.63639H14V0.969727H7.77778Z" />
                  </svg>
                </i>
                <span>{props.t("Home")}</span>
              </Link>
            </li>

            {/* <li>
              <Link to="/dashboard" className="">
                <i>
                  <svg
                    width={14}
                    height={15}
                    viewBox="0 0 14 15"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M0 8.7475H6.22222V0.969727H0V8.7475ZM0 14.9697H6.22222V10.3031H0V14.9697ZM7.77778 14.9697H14V7.19195H7.77778V14.9697ZM7.77778 0.969727V5.63639H14V0.969727H7.77778Z" />
                  </svg>
                </i>

                <span>{props.t("Dashboard")}</span>
              </Link>
            </li> */}

            {/* <li>
              <Link to="/conversations" className="">
                <i>
                  <svg
                    width={14}
                    height={15}
                    viewBox="0 0 14 15"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M13.3 3.76973H11.9V10.0697H2.8V11.4697C2.8 11.8547 3.115 12.1697 3.5 12.1697H11.2L14 14.9697V4.46973C14 4.08473 13.685 3.76973 13.3 3.76973ZM10.5 7.96973V1.66973C10.5 1.28473 10.185 0.969727 9.8 0.969727H0.7C0.315 0.969727 0 1.28473 0 1.66973V11.4697L2.8 8.66973H9.8C10.185 8.66973 10.5 8.35473 10.5 7.96973Z" />
                  </svg>
                </i>
                <span>{props.t("Conversations")}</span>
              </Link>
            </li> */}

            {/* <li>
              <Link to="/roleplay">
                <i>
                  <svg
                    width={14}
                    height={15}
                    viewBox="0 0 14 15"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g clipPath="url(#clip0_978_3567)">
                      <path d="M5.25598 8.86714C4.53328 8.86714 3.91439 8.61068 3.3993 8.09776C2.88509 7.58572 2.62799 6.96987 2.62799 6.25022C2.62799 5.53057 2.88509 4.91428 3.3993 4.40137C3.91439 3.88932 4.53328 3.6333 5.25598 3.6333C5.97868 3.6333 6.59713 3.88932 7.11134 4.40137C7.62643 4.91428 7.88397 5.53057 7.88397 6.25022C7.88397 6.96987 7.62643 7.58572 7.11134 8.09776C6.59713 8.61068 5.97868 8.86714 5.25598 8.86714ZM0 14.101V13.3486C0 12.8252 0.14235 12.3455 0.427048 11.9093C0.711747 11.4732 1.10595 11.146 1.60964 10.928C2.17904 10.6881 2.76465 10.5027 3.36646 10.3719C3.96914 10.241 4.59898 10.1756 5.25598 10.1756C5.91298 10.1756 6.54282 10.241 7.1455 10.3719C7.74731 10.5027 8.33292 10.6881 8.90232 10.928C9.40601 11.146 9.80021 11.4732 10.0849 11.9093C10.3696 12.3455 10.512 12.8252 10.512 13.3486V14.101H0Z" />
                      <path d="M9.31421 7.16658L10.3286 8.17672C10.8439 7.56743 11.1015 6.86193 11.1015 6.06024C11.1015 5.25854 10.8439 4.55304 10.3286 3.94375L9.31421 4.97794C9.53963 5.29862 9.65235 5.66323 9.65235 6.07178C9.65235 6.48097 9.53963 6.8459 9.31421 7.16658Z" />
                      <path d="M11.343 9.21091L12.3816 10.2451C12.913 9.65185 13.3155 8.99446 13.5892 8.27293C13.863 7.5514 13.9998 6.81768 13.9998 6.07178C13.9998 5.32652 13.863 4.59313 13.5892 3.8716C13.3155 3.15007 12.913 2.49267 12.3816 1.89941L11.343 2.93361C12.1481 3.83151 12.5507 4.87757 12.5507 6.07178C12.5507 7.26663 12.1481 8.31301 11.343 9.21091Z" />
                    </g>
                    <defs>
                      <clipPath id="clip0_978_3567">
                        <rect
                          width={14}
                          height={14}
                          transform="translate(0 0.969727)"
                        />
                      </clipPath>
                    </defs>
                  </svg>
                </i>
                <span>{props.t("Roleplay")}</span>
              </Link>
            </li> */}

            <li>
              <Link to="/chat-interface" className="">
                <i className="bx bxs-chat"></i>
                <span>{props.t("Assistant")}</span>
              </Link>
            </li>

            <li>
              <a href="https://docs.chainwide.io" target="_blank" rel="noopener noreferrer" className="">
                <i className="bx bxs-file"></i>
                <span>Documentation</span>
              </a>

            </li>

            {/* {isAdmin && (
              <>
                <li>
                  <Link to="/assignments">
                    <i>
                      <svg
                        width={14}
                        height={15}
                        viewBox="0 0 14 15"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.7057 0.969727V4.98855L6.12697 9.56738C5.89638 9.79796 5.76462 10.1109 5.76462 10.4403V13.3227H8.64693C8.97634 13.3227 9.28928 13.1909 9.51986 12.9603L10.7057 11.7744V14.9697H0V0.969727H10.7057ZM11.6495 5.20843C11.8109 5.04702 12.0711 5.04702 12.2325 5.20843L13.8796 6.85549C14.0401 7.01608 14.0401 7.27632 13.8796 7.43773L8.93845 12.3789C8.86104 12.4555 8.75645 12.4991 8.64693 12.4991H6.58814V10.4403C6.58814 10.3308 6.63178 10.2262 6.70838 10.1496L11.6495 5.20843ZM4.9411 9.20502H2.47056V10.0286H4.94111L4.9411 9.20502ZM6.58814 7.55796H2.47055V8.38149H6.58813V7.55796H6.58814ZM11.941 6.08138L11.288 6.73443L12.3528 7.79925L13.0058 7.1462L11.941 6.08138ZM8.23517 3.44032H2.47056V5.9109H8.23518V3.44033L8.23517 3.44032Z"
                        />
                      </svg>
                    </i>
                    <span>{props.t("Assignments")}</span>
                  </Link>
                </li>

                <li>
                  <Link to="/knowledgebase">
                    <i>
                      <svg
                        width={14}
                        height={15}
                        viewBox="0 0 14 15"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M13.9625 12.9272L11.0947 1.82162C11.0184 1.52725 10.8326 1.27632 10.5782 1.12391C10.3238 0.971496 10.0214 0.930045 9.7376 1.00865L7.59697 1.6038C7.57347 1.61033 7.55101 1.61883 7.52826 1.62682C7.42522 1.48592 7.29219 1.37164 7.13954 1.29291C6.9869 1.21419 6.81878 1.17315 6.64832 1.173H4.43221C4.23752 1.17306 4.04634 1.22674 3.87819 1.32857C3.71004 1.22674 3.51885 1.17306 3.32416 1.173H1.10805C0.814282 1.17335 0.53264 1.29459 0.324912 1.51013C0.117185 1.72567 0.000335974 2.01791 0 2.32273V13.82C0.000335974 14.1248 0.117185 14.4171 0.324912 14.6326C0.53264 14.8481 0.814282 14.9694 1.10805 14.9697H3.32416C3.51885 14.9697 3.71004 14.916 3.87819 14.8142C4.04634 14.916 4.23752 14.9697 4.43221 14.9697H6.64832C6.94209 14.9694 7.22373 14.8481 7.43146 14.6326C7.63919 14.4171 7.75604 14.1248 7.75637 13.82V6.66315L9.68133 14.1174C9.71892 14.2633 9.78385 14.4 9.87242 14.5199C9.96098 14.6397 10.0714 14.7402 10.1975 14.8158C10.3235 14.8913 10.4626 14.9403 10.6069 14.9599C10.7512 14.9796 10.8978 14.9696 11.0384 14.9304L13.179 14.3353C13.4627 14.2561 13.7045 14.0633 13.8514 13.7993C13.9983 13.5354 14.0382 13.2217 13.9625 12.9272ZM10.0244 2.11915L10.4546 3.78499L8.31395 4.38015L7.88379 2.71437L10.0244 2.11915ZM6.64832 2.32273L6.64883 10.9457H4.43221V2.32273H6.64832ZM3.32416 2.32273V4.04732H1.10805V2.32273H3.32416ZM6.64832 13.82H4.43221V12.0954H6.64889L6.649 13.82H6.64832ZM12.8922 13.2247L10.7516 13.8199L10.3215 12.1541L12.4626 11.5587L12.8929 13.2245L12.8922 13.2247Z" />
                      </svg>
                    </i>
                    <span>{props.t("Knowledge Base")}</span>
                  </Link>
                </li>
                <li>
                  <Link className="has-arrow">
                    <i>
                      <svg
                        width="14"
                        height="16"
                        viewBox="0 0 14 16"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M11.3238 7.96973L11.3238 8.77255C11.6828 8.90183 12.011 9.09725 12.2946 9.34445L12.9776 8.94262L14 10.7468L13.3174 11.1484C13.3509 11.3337 13.3685 11.5246 13.3685 11.7197C13.3685 11.9149 13.3509 12.1058 13.3174 12.291L14 12.6926L12.9776 14.4968L12.2946 14.095C12.011 14.3422 11.6828 14.5376 11.3238 14.6669L11.3238 15.4697H9.27905L9.27903 14.6669C8.92008 14.5376 8.5918 14.3422 8.3083 14.095L7.62518 14.4968L6.60282 12.6926L7.28546 12.291C7.25188 12.1058 7.23432 11.9149 7.23432 11.7197C7.23432 11.5246 7.25188 11.3336 7.28547 11.1484L6.60282 10.7468L7.62518 8.94262L8.30826 9.34446C8.59177 9.09725 8.92006 8.90183 9.27903 8.77255L9.27905 7.96973H11.3238ZM6.44088 7.21973C7.11147 7.21973 7.74217 7.39873 8.29185 7.71362C6.86503 8.45955 5.8888 9.97348 5.8888 11.7197C5.8888 12.5394 6.10387 13.3078 6.47965 13.9697L0 13.9697V11.2697C0 9.08889 1.64478 7.31065 3.70523 7.2231L3.86453 7.21973H6.44088ZM10.3014 10.4697C9.62385 10.4697 9.07458 11.0294 9.07458 11.7197C9.07458 12.4101 9.62385 12.9697 10.3014 12.9697C10.979 12.9697 11.5282 12.4101 11.5282 11.7197C11.5282 11.0294 10.979 10.4697 10.3014 10.4697ZM5.1527 0.469727C6.57558 0.469727 7.72905 1.64498 7.72905 3.09473C7.72905 4.49615 6.6512 5.64107 5.29406 5.71584L5.1527 5.71973C3.72982 5.71973 2.57635 4.54447 2.57635 3.09473C2.57635 1.6933 3.65421 0.548382 5.01135 0.473611L5.1527 0.469727Z"
                        />
                      </svg>
                    </i>
                    <span>{props.t("User Management")}</span>
                  </Link>
                  <ul className="sub-menu" aria-expanded="false">
                    <li>
                      <Link to="/user-management">{props.t("Add Users")}</Link>
                    </li>
                  </ul>
                </li>
              </>
            )} */}

            {/* <li>
              <Link to="/support">
                <i className="bx bx-support"></i>
                  <span>{props.t("Support")}</span>
              </Link>
            </li> */}
          </ul>
        </div>
      </SimpleBar>
      <div className="w-full  h-max flex flex-col gap-3 items-center pb-4 lg:pb-10 pt-2 !bg-[#6A6A6A]/5">
        <img src={HavingTroubleIcon} className="w-[76px] h-[56px]" />
        <p className="text-white">Having Trouble?</p>
        <a href="/support" className="w-full">
          <Button
            variant="outline"
            className="!border-primaryColor !bg-card-color w-full"
          >
            Get Support
          </Button>
        </a>
      </div>
    </div>
  );
};

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
};

export default withRouter(withTranslation()(SidebarContent));
