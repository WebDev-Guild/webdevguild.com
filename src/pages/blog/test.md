---
setup: |
  import Three from '../../components/react/three.tsx'
  import Sandpack from '../../components/Sandpack.astro'
  import Aside from '../../components/Aside.astro'
layout: "../../layouts/BlogPost.astro"
title: A Primer on 3D Graphics on the Web
publishDate: 2022-06-02
description: Just a Hello World Post!
heroImage: "/social.png"
draft: true
---

You might have seen these kinds of sites and demos - interactive 3D content entirely built with web technologies.

<iframe class="w-full h-96" scrolling="no" title="Ghost Card" src="https://codepen.io/pizza3/embed/preview/pobevYW?default-tab=result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href="https://codepen.io/pizza3/pen/pobevYW">
  Ghost Card</a> by Yugam (<a href="https://codepen.io/pizza3">@pizza3</a>)
  on <a href="https://codepen.io">CodePen</a>.
</iframe>

Pretty cool! But where do you even start with building something like this? If you've never had experience with 3D content, you might not be familiar with the terminology and techniques that go into creating 3D graphics.

<Aside title="What to expect">

This post covers high-level concepts, not how to build a 3D renderer from scratch. We won't go too deep into math, graphics card pipelines, or how to implement a WebGL engine from scratch. Instead, we'll use [three.js](https://threejs.org) and [React Three Fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) which create easy to use abstractions for all of these concepts.

If you aren't a React developer, don't fret! Most of these principles apply any time you're working with 3D on the web.

</Aside>

## Setting the Scene

Think about how you experience the 3D world around you. You have eyes which can detect light coming into them. That light came from the sun, light bulbs, and computer screens, bounced off of different objects, and eventually landed in your eyes for you to detect.

_TODO: Insert an image of eyes seeing an object, along with a camera seeing an object._

We use the same principles to make 3D graphics. Lights illuminate objects in a 3D scene, and a camera captures that light. Over the years a lot of effort has gone into making this process faster with higher fidelity, but whether you're building a AAA game or blockbuster movie, your scenes will still be composed of lights, cameras, and objects.

Each object has different properties that affect how it contributes to the final image. For example, different lights could have distinct colors, intensities, and positions.

<Sandpack files={{
   "/App.tsx": "react/three/Lights.tsx",
   "/ThreeBase.tsx": "react/three/ThreeBase.tsx",
   "/Box.tsx": "react/three/Box.tsx",
   "/styles.css":"react/three/styles.css"
    }}
customSetup={{
     dependencies: {
       "@react-three/fiber":"^8.0.21",
       "three":"^0.141.0"
     }
   }} />

<Aside title="Kinds of lights">

The light from the sun is very different from the light of a single lightbulb - that's why 3D graphics programs often have several varieties of light to use for different visual effects.

<details>
<summary>Show More</summary>

three.js includes 6 classes of lights:

- [AmbientLight](https://threejs.org/docs/api/en/lights/AmbientLight.html) - Illuminates every object in the scene equally.
- [DirectionalLight](https://threejs.org/docs/api/en/lights/DirectionalLight.html) - Emits light in a specific direction using parallel rays. Its commonly used to simulate the sun.
- [HemisphereLight](https://threejs.org/docs/api/en/lights/HemisphereLight.html) - Emits light from above the scene, with the color fading between sky and ground.
- [PointLight](https://threejs.org/docs/api/en/lights/PointLight.html) - Emits light in all directions from a specific point, like a lightbulb.
- [RectAreaLight](https://threejs.org/docs/api/en/lights/RectAreaLight.html) - Emits light from a rectangular plane or strip, like a window or a long lightbulb.
- [SpotLight](https://threejs.org/docs/api/en/lights/SpotLight.html) - Emits light from a point in a specific direction, with the light rays spreading in a cone shape.

</details>

</Aside>

```javascript
// Example JavaScript

const x = 7;
function returnSeven() {
  return x;
}
```

<Three client:visible className="w-full h-96 rounded-lg bg-gray-900"/>
