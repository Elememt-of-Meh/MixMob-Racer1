// ==UserScript==
// @name         MixMob MixBot STATS Score 2.1
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Check the STATS of MixBots on Magic Eden!
// @author       ercalote (Edited by Origami)
// @match        https://magiceden.io/marketplace/mixbots
// @match        https://magiceden.io/*
// @match        https://www.magiceden.io/*
// @icon         https://www.google.com/s2/favicons?domain=magiceden.io
// @grant        GM_log
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

function findParentWithDataIndex(element) {
    if (!element) return null;
    if (element.getAttribute('data-index') !== null) {
        return element;
    }
    return findParentWithDataIndex(element.parentElement);
}

function createParagraph(text, score) {
    var paragraph = document.createElement('p');
    paragraph.textContent = text + ': ' + score;

    switch(text) {
        case 'Faction':
            if (score === 'Boff') {
                paragraph.style.color = '#5ACEFF'; // blue
            } else if (score === 'Tek') {
                paragraph.style.color = '#FFFF55'; // yellow
            } else if (score === 'Styler') {
                paragraph.style.color = '#68FF68'; // green
            }
            break;
        case 'MixScore':
            paragraph.style.color = '#FF6176'; // light red
            break;
        case 'MaxSpeed':
            paragraph.style.color = '#EFEFEF';
            break;
        case 'Acceleration':
            paragraph.style.color = '#F5F5F5';
            break;
        case 'Willpower':
            paragraph.style.color = '#EFEFEF';
            break;
        case 'Durability':
            paragraph.style.color = '#F5F5F5';
            break;
    }

    return paragraph;
}

(function() {
    'use strict';

    let addedDivs = new Set();
    var styles = `
    table.tw-w-full tr {
        height: 9rem;
    }
    `;
    var styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    function addDivAfterImage(image) {
        if (!addedDivs.has(image)) {
            var slug = (image.src.match(/SLUG/g) || []).length;
            var huntr = (image.src.match(/HUNTR/g) || []).length;
            var grnt = (image.src.match(/GRNT/g) || []).length;
            var wzrd = (image.src.match(/WZRD/g) || []).length;
            var lzrd = (image.src.match(/LZRD/g) || []).length;
            var fink = (image.src.match(/FINK/g) || []).length;
            var kng = (image.src.match(/KNG/g) || []).length;
            var mnstr = (image.src.match(/MNSTR/g) || []).length;

            var unique = (image.src.match(/Unique/g) || []).length;
            var glitch = (image.src.match(/Glitch/g) || []).length;
            var metal = (image.src.match(/Metal/g) || []).length;
            var synth = (image.src.match(/Synth/g) || []).length;
            var og = (image.src.match(/OG/g) || []).length;
            var odd = (image.src.match(/Odd/g) || []).length;
            var mixscore = unique * 10 + glitch * 10 + metal * 7 + synth * 5 + og * 2 + odd * 2;

            var acceleration = 10 - slug + huntr + fink - kng;
            var max_speed = 10 + slug - wzrd + lzrd - fink;
            var durability = 10 - huntr + grnt + kng - mnstr;
            var willpower = 10 - grnt + wzrd - lzrd + mnstr;

            var factionMatch = image.src.match(/mixbots\/(.*?)_/);
            var faction = factionMatch ? factionMatch[1] : null;

            var parentDivWithDataIndex = findParentWithDataIndex(image);
            if (!parentDivWithDataIndex) {
                parentDivWithDataIndex = image.parentElement.parentElement.parentElement.parentElement;
            }

            if (parentDivWithDataIndex) {
                var firstChildDiv = parentDivWithDataIndex.firstElementChild;
                if (firstChildDiv) {
                    var newDiv = document.createElement('div');
                    newDiv.appendChild(createParagraph('Faction', faction));
                    newDiv.appendChild(createParagraph('MaxSpeed', max_speed));
                    newDiv.appendChild(createParagraph('Acceleration', acceleration));
                    newDiv.appendChild(createParagraph('Willpower', willpower));
                    newDiv.appendChild(createParagraph('Durability', durability));
                    newDiv.appendChild(createParagraph('MixScore', mixscore));

                    firstChildDiv.lastElementChild.appendChild(newDiv);
                }
            }

            addedDivs.add(image);
        }
    }

    function processImages() {
        const images = document.querySelectorAll('img');
        for (var i = 0; i < images.length; i++) {
            if (images[i].src.includes('mixbot')) {
                addDivAfterImage(images[i]);
            }
        }
    }

    setInterval(processImages, 200);

})();