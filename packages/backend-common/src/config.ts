/*
 * Copyright 2020 Spotify AB
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { resolve as resolvePath } from 'path';
import parseArgs from 'minimist';
import { Logger } from 'winston';
import { findPaths } from '@backstage/cli-common';
import { Config, ConfigReader } from '@backstage/config';
import { loadConfig } from '@backstage/config-loader';

type Options = {
  logger: Logger;
  // process.argv or any other overrides
  argv: string[];
};

/**
 * Load configuration for a Backend
 */
export async function loadBackendConfig(options: Options): Promise<Config> {
  const args = parseArgs(options.argv);
  const configOpts: string[] = [args.config ?? []].flat();

  /* eslint-disable-next-line no-restricted-syntax */
  const paths = findPaths(__dirname);
  const configs = await loadConfig({
    env: process.env.APP_ENV ?? process.env.NODE_ENV ?? 'development',
    configRoot: paths.targetRoot,
    configPaths: configOpts.map(opt => resolvePath(opt)),
    shouldReadSecrets: true,
  });

  options.logger.info(
    `Loaded config from ${configs.map(c => c.context).join(', ')}`,
  );

  return ConfigReader.fromConfigs(configs);
}
