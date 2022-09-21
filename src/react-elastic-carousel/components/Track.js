import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Swipeable } from "react-swipeable";
import { cssPrefix } from "../utils/helpers";
import ItemWrapperContainer from "./ItemWrapperContainer";

const Track = ({
  children,
  childWidth,
  autoTabIndexVisibleItems,
  enableSwipe,
  enableMouseSwipe,
  preventDefaultTouchmoveEvent,
  itemsToShow,
  itemsToScroll,
  currentItem,
  itemPosition,
  itemPadding,
  onSwiped,
  onSwiping,
  verticalMode,
  onItemClick
}) => {
  const width = `${childWidth}px`;
  const paddingStyle = `${itemPadding.join("px ")}px`;
  const minVisibleItem = currentItem;
  const maxVisibleItem = currentItem + itemsToShow;
  const prevItem = minVisibleItem - itemsToScroll;
  const nextItem = maxVisibleItem + itemsToScroll;

  const originalChildren = useMemo(
    () => {
      return React.Children.map(
        React.Children.toArray(children),
        (child, idx) => {
          const isVisible = idx >= minVisibleItem && idx < maxVisibleItem;
          const isPrevItem = !isVisible && idx >= prevItem && idx < currentItem;
          const isNextItem = !isVisible && idx < nextItem && idx > currentItem;
          const itemClass = "carousel-item";

          const childToRender = autoTabIndexVisibleItems
            ? React.cloneElement(child, {
                tabIndex: isVisible ? 0 : -1
              })
            : child;
          return (
            <div
              className={cssPrefix(
                itemClass,
                `${itemClass}-${idx}`,
                `${itemClass}-${isVisible ? "visible" : "hidden"}`,
                isPrevItem && `${itemClass}-prev`,
                isNextItem && `${itemClass}-next`
              )}
            >
              <ItemWrapperContainer
                id={idx}
                itemPosition={itemPosition}
                style={{ width, padding: paddingStyle }}
                key={idx}
                onClick={onItemClick}
              >
                {childToRender}
              </ItemWrapperContainer>
            </div>
          );
        }
      );
    },
    [
      children,
      width,
      paddingStyle,
      minVisibleItem,
      maxVisibleItem,
      prevItem,
      nextItem,
      autoTabIndexVisibleItems,
      cssPrefix
    ]
  );

  const styles = useMemo(
    () => {
      return {
        display: "flex",
        flexDirection: verticalMode ? "column" : "row"
      };
    },
    [verticalMode]
  );

  const toRender = enableSwipe ? (
    <Swipeable
      style={styles}
      stopPropagation
      preventDefaultTouchmoveEvent={preventDefaultTouchmoveEvent}
      trackMouse={enableMouseSwipe}
      onSwiped={onSwiped}
      onSwiping={onSwiping}
      className={cssPrefix("swipable")}
    >
      {originalChildren}
    </Swipeable>
  ) : (
    originalChildren
  );
  return toRender;
};

Track.propTypes = {
  children: PropTypes.array.isRequired,
  itemsToShow: PropTypes.number.isRequired,
  noAutoTabbedItems: PropTypes.bool,
  currentItem: PropTypes.number.isRequired,
  itemPosition: PropTypes.string,
  itemPadding: PropTypes.array,
  childWidth: PropTypes.number,
  verticalMode: PropTypes.bool,
  enableSwipe: PropTypes.bool,
  enableMouseSwipe: PropTypes.bool,
  preventDefaultTouchmoveEvent: PropTypes.bool,
  onSwiped: PropTypes.func,
  onSwiping: PropTypes.func,
  onItemClick: PropTypes.func
};

export default Track;
