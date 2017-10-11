#!/usr/bin/env node

'use strict';

// Taken and adapted from https://github.com/derhuerst/german-license-plate-prefixes

const fs = require('fs');

const download = require('got'),
      parser = require('csv-parser');

const source =
  'http://berlin.de/daten/liste-der-kfz-kennzeichen/kfz-kennz-d.csv';

const stateMapping = {
  'Baden-Württemberg': 'bw',
  Bayern: 'by',
  Berlin: 'be',
  Brandenburg: 'bb',
  Bremen: 'hb',
  Hamburg: 'hh',
  Hessen: 'he',
  'Mecklenburg-Vorpommern': 'mv',
  Niedersachsen: 'ni',
  'Nordrhein-Westfalen': 'nw',
  'Rheinland-Pfalz': 'rp',
  Saarland: 'sl',
  Sachsen: 'sn',
  'Sachsen-Anhalt': 'st',
  'Schleswig-Holstein': 'sh',
  Thüringen: 'th'
};

const data = {
  CLP: {
    id: 'CLP',
    community: 'Landkreis Cloppenburg',
    state: {
      shortCut: 'ni',
      name: 'Niedersachsen'
    }
  },
  NT: {
    id: 'NT',
    community: 'Landkreis Esslingen',
    state: {
      shortCut: 'bw',
      name: 'Baden-Württemberg'
    }
  }
};

download.
  stream(source).
  pipe(parser()).
  on('data', entry => {
    data[entry['Kennzeichen, Juli 2012']] = {
      id: entry['Kennzeichen, Juli 2012'],
      community: entry['Stadt bzw. Landkreis'],
      state: {
        shortCut: stateMapping[entry.Bundesland],
        name: entry.Bundesland
      }
    };
  }).
  on('end', () => {
    const file = fs.createWriteStream('./lib/kennzeichen.json');

    file.on('finish', () => console.info('Done.'));
    file.end(JSON.stringify(data));
  });
