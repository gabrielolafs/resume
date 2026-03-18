Order matters! I did not want to hard code an order value as that would take a lot of work to change in the future. instead the index pos dictates where it will go.

so how this will be built out is in a 2d array. pages -> colums

so if we only had 2 articles for example this is what it would look like on the screen

``` json
[
    {
        "title": "example", // this is the url and file name of the article. ex this will lead to /articles/example
        "glb": "/scans/example.glb", // the scans from polycam
        "model": {
            "position": [0, 0, 0], // dont think this will change but nice to have
            "rotation": [0, 0, 0], // rotation - static for this example. controls x y and z (this is a potential issue with gimble lock... im not thinking too hard about that as this will only have to rotate in 2 dimentions at most i believe. i also want this to be able to be a trig function for some more wonky movements, but this is mvp)
            "scale": 1
        }
    }
]
```