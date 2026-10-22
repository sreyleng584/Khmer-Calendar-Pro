/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudLightning,
  Snowflake,
  Wind,
} from 'lucide-react';
import { WeatherConditionInfo } from '../services/weatherService.ts';

interface WeatherIconProps {
  condition?: WeatherConditionInfo;
  iconName?: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({
  condition,
  iconName,
  className = 'w-5 h-5',
}) => {
  const name = iconName || condition?.iconName || 'sun';

  switch (name) {
    case 'sun':
      return <Sun className={`${className} text-amber-300 fill-amber-300/30`} />;
    case 'cloud-sun':
      return <CloudSun className={`${className} text-amber-200 fill-amber-300/20`} />;
    case 'cloud':
      return <Cloud className={`${className} text-stone-200 fill-stone-200/20`} />;
    case 'cloud-fog':
      return <CloudFog className={`${className} text-stone-300`} />;
    case 'cloud-drizzle':
      return <CloudDrizzle className={`${className} text-sky-300`} />;
    case 'cloud-rain':
      return <CloudRain className={`${className} text-sky-400`} />;
    case 'cloud-lightning':
      return <CloudLightning className={`${className} text-amber-300`} />;
    case 'snowflake':
      return <Snowflake className={`${className} text-sky-200`} />;
    case 'wind':
      return <Wind className={`${className} text-teal-300`} />;
    default:
      return <Sun className={`${className} text-amber-300`} />;
  }
};
