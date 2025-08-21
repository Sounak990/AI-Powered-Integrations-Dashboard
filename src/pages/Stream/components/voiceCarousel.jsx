import React, { Component } from "react";
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
} from "reactstrap";

class VoiceCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0,
      selectedImageIndex: null, // Track the selected image index
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
    this.selectImage = this.selectImage.bind(this); // Bind the select image function
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === Math.ceil(this.props.items.length / 5) - 1
        ? 0
        : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex =
      this.state.activeIndex === 0
        ? Math.ceil(this.props.items.length / 5) - 1
        : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }

  selectImage(index) {
    this.setState({ selectedImageIndex: index });
    if (this.props.onImageSelect) {
      this.props.onImageSelect(this.props.items[index].altText);
    }
  }

  render() {
    const { activeIndex, selectedImageIndex } = this.state;
    const { items } = this.props;

    const slides = [];
    for (let i = 0; i < items.length; i += 5) {
      const slideItems = items.slice(i, i + 5).map((item, index) => {
        const globalIndex = i + index; // Calculate the global index of the item
        return (
          <div
            key={index}
            className="col"
            style={{
              width: "200px",
              height: "200px",
              padding: "5px",
              cursor: "pointer",
              border:
                selectedImageIndex === globalIndex
                  ? "3px solid #007bff"
                  : "1px solid transparent",
              boxSizing: "border-box",
            }}
            onClick={() => this.selectImage(globalIndex)}
          >
            <img
              src={item.src}
              alt={item.altText}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>
        );
      });

      // Ensure each slide has exactly 5 items by adding empty divs if necessary
      while (slideItems.length < 5) {
        slideItems.push(
          <div
            key={`empty-${slideItems.length}`}
            className="col"
            style={{
              width: "200px",
              height: "200px",
              padding: "5px",
              border: "1px solid transparent",
            }}
          >
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#f0f0f0",
              }}
            ></div>
          </div>
        );
      }

      slides.push(
        <CarouselItem
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={i}
        >
          <div className="row justify-content-center">{slideItems}</div>
        </CarouselItem>
      );
    }

    return (
      <Carousel
        activeIndex={activeIndex}
        next={this.next}
        previous={this.previous}
        interval={false} // Disable automatic sliding
      >
        <CarouselIndicators
          items={slides}
          activeIndex={activeIndex}
          onClickHandler={this.goToIndex}
        />
        {slides}
        <CarouselControl
          direction="prev"
          directionText="Previous"
          onClickHandler={this.previous}
        />
        <CarouselControl
          direction="next"
          directionText="Next"
          onClickHandler={this.next}
        />
      </Carousel>
    );
  }
}

export default VoiceCarousel;
