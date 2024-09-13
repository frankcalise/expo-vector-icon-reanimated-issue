import * as React from "react";
import { Pressable, View, ViewStyle, useWindowDimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
  withDelay,
  WithSpringConfig,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DURATION = 150;
const TRANSLATE_Y = -80;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function FloatingButton() {
  const { width } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();

  const isOpened = React.useRef(false);
  const transYDumbbell = useSharedValue(0);
  const transYYoga = useSharedValue(0);
  const transYWalk = useSharedValue(0);
  const opacity = useSharedValue(1);

  function $viewStyle({ pressed }) {
    return pressed
      ? [$plusButton, { transform: [{ scale: 0.9 }] }]
      : [$plusButton];
  }

  const $rDumbbellStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: transYDumbbell.value },
        { scale: interpolate(transYDumbbell.value, [TRANSLATE_Y, 0], [1, 0]) },
      ],
    };
  });

  const $rWalkStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            transYWalk.value,
            [TRANSLATE_Y, 0],
            [TRANSLATE_Y / 2, 0]
          ),
        },
        {
          translateX: interpolate(transYWalk.value, [TRANSLATE_Y, 0], [-60, 0]),
        },
        { scale: interpolate(transYWalk.value, [TRANSLATE_Y, 0], [1, 0]) },
      ],
    };
  });

  const $rYogaStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(transYYoga.value, [TRANSLATE_Y, 0], [26, 0]),
        },
        { translateX: transYYoga.value },
        { scale: interpolate(transYYoga.value, [TRANSLATE_Y, 0], [1, 0]) },
      ],
    };
  });

  const $rPlusStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotateZ:
            interpolate(opacity.value, [0, 1], [-135, 0]).toString() + "deg",
        },
      ],
    };
  });
  function handlePress() {
    if (isOpened.current) {
      transYDumbbell.value = withDelay(
        DURATION * 2,
        withTiming(0, {
          duration: DURATION * 2,
          easing: Easing.bezierFn(0.36, 0, 0.66, -0.56),
        })
      );
      transYWalk.value = withDelay(
        DURATION,
        withTiming(0, {
          duration: DURATION * 2,
          easing: Easing.bezierFn(0.36, 0, 0.66, -0.56),
        })
      );
      transYYoga.value = withTiming(0, {
        duration: DURATION * 2,
        easing: Easing.bezierFn(0.36, 0, 0.66, -0.56),
      });
      opacity.value = withTiming(1, { duration: DURATION * 2 });
    } else {
      const config: WithSpringConfig = { damping: 12 };
      transYDumbbell.value = withSpring(TRANSLATE_Y, config);
      transYWalk.value = withDelay(
        DURATION / 2,
        withSpring(TRANSLATE_Y, config)
      );
      transYYoga.value = withDelay(DURATION, withSpring(TRANSLATE_Y, config));
      opacity.value = withTiming(0, { duration: DURATION * 2 });
    }

    isOpened.current = !isOpened.current;
  }

  return (
    <View style={$container}>
      <AnimatedPressable
        onPress={() => console.log("db pressed")}
        style={[$button, $rDumbbellStyles]}
      >
        <FontAwesome5
          icon="dumbbell"
          size={28}
          color="white"
          allowFontScaling={false}
        />
      </AnimatedPressable>
      <AnimatedPressable
        onPress={() => console.log("walk pressed")}
        style={[$rWalkStyles, $button]}
      >
        <MaterialCommunityIcons
          icon="plus"
          size={24}
          allowFontScaling={false}
        />
      </AnimatedPressable>
      <AnimatedPressable
        onPress={() => console.log("yoga pressed")}
        style={[$button, $rYogaStyles]}
      >
        <MaterialCommunityIcons
          icon="yoga"
          size={28}
          color="white"
          allowFontScaling={false}
        />
      </AnimatedPressable>

      <Pressable onPress={handlePress} style={$viewStyle}>
        <Animated.View style={$rPlusStyles}>
          <MaterialCommunityIcons
            name="plus"
            size={36}
            color="white"
            allowFontScaling={false}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
}

const $container: ViewStyle = {
  position: "absolute",
  bottom: 50,
  right: 30,
};

const $plusButton: ViewStyle = {
  width: 60,
  height: 60,
  backgroundColor: "black",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 30,
};

const $button: ViewStyle = {
  width: 50,
  height: 50,
  backgroundColor: "blue",
  justifyContent: "center",
  alignItems: "center",
  borderRadius: 30,
  position: "absolute",
};
