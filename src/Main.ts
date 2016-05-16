/// <reference path="../typings/tsd.d.ts" />
import {parse} from './Parser';
import {Renderer} from './Renderer';

//[TODO] - Inline and unrole optimize for 3d case.
var renderer = new Renderer();

window.fetch('https://space-fast-track.herokuapp.com/generate')
    .then(x => x.text())
    .then(x => parse(x))
    .then(x => {
        var pathEl = document.getElementById('path');
        var distanceEl = document.getElementById('distance');
        var seedEl = document.getElementById('seed');

        seedEl.innerText = x.seed;

        if (x.answer.path.length > 0) {    
            distanceEl.innerText = `${x.answer.distance.toFixed(1)}Km`;
            pathEl.innerText = x.answer.path.join(',');
        } else {
            distanceEl.innerText = `No solution found.`;
            pathEl.innerText = '';
        }
        renderer.drawSolution(x);
    });