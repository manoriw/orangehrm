<?php
/**
 * OrangeHRM is a comprehensive Human Resource Management (HRM) System that captures
 * all the essential functionalities required for any enterprise.
 * Copyright (C) 2006 OrangeHRM Inc., http://www.orangehrm.com
 *
 * OrangeHRM is free software; you can redistribute it and/or modify it under the terms of
 * the GNU General Public License as published by the Free Software Foundation; either
 * version 2 of the License, or (at your option) any later version.
 *
 * OrangeHRM is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along with this program;
 * if not, write to the Free Software Foundation, Inc., 51 Franklin Street, Fifth Floor,
 * Boston, MA  02110-1301, USA
 */

namespace OrangeHRM\Core\Api\V2;

class RequestParams
{
    public const PARAM_TYPE_BODY = 'body';
    public const PARAM_TYPE_ATTRIBUTE = 'attributes';
    public const PARAM_TYPE_QUERY = 'query';

    /**
     * Request body parameters ($_POST)
     * @var ParameterBag
     */
    protected ParameterBag $body;

    /**
     * Parameters from URL
     * @var ParameterBag
     */
    protected ParameterBag $attributes;

    /**
     * Query string parameters ($_GET)
     * @var ParameterBag
     */
    protected ParameterBag $query;

    public function __construct(Request $request)
    {
        $this->body = $request->getBody();
        $this->attributes = $request->getAttributes();
        $this->query = $request->getQuery();
    }

    /**
     * @param string $type
     * @param string $key
     * @param string $default
     * @return string
     */
    public function getString(string $type, string $key, string $default = ''): string
    {
        return $this->$type->get($key, $default);
    }

    /**
     * @param string $type
     * @param string $key
     * @param int $default
     * @return int
     */
    public function getInt(string $type, string $key, int $default = 0): int
    {
        return $this->$type->getInt($key, $default);
    }

    /**
     * @param string $type
     * @param string $key
     * @param bool $default
     * @return bool
     */
    public function getBoolean(string $type, string $key, bool $default = false): bool
    {
        return $this->$type->getInt($key, $default);
    }

    /**
     * @param string $type
     * @param string $key
     * @param array $default
     * @return array
     */
    public function getArray(string $type, string $key, array $default = []): array
    {
        return $this->$type->get($key, $default);
    }

    /**
     * @param string $type
     * @param string $key
     * @param array $default
     * @return array|null
     */
    public function getArrayOrNull(string $type, string $key, array $default = []): ?array
    {
        return $this->$type->get($key, $default);
    }
}