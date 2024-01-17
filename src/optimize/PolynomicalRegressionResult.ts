/**
 * @author @thkruz Theodore Kruczek
 *
 * @license AGPL-3.0-or-later
 * @copyright (c) 2020-2024 Theodore Kruczek
 *
 * Orbital Object ToolKit is free software: you can redistribute it and/or modify it under the
 * terms of the GNU Affero General Public License as published by the Free Software
 * Foundation, either version 3 of the License, or (at your option) any later version.
 *
 * Orbital Object ToolKit is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY;
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 * See the GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License along with
 * Orbital Object ToolKit. If not, see <http://www.gnu.org/licenses/>.
 */

// / Polynomial regression optimization result.
export class PolynomicalRegressionResult {
  /**
   * Create a new [PolynomicalRegressionResult] object, containing the
   * polynomial [coefficients], root-sum-squared error [rss], and Bayes
   * information criterea [bic].
   */
  constructor(public coefficients: Float64Array, public rss: number, public bic: number) {
    // Nothing to do here.
  }
}
