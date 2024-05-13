class Solution {
    public int[][] largestLocal(int[][] grid) {
        int n = grid.length, m = grid[0].length;
        int[][] result = new int[n - 2][m - 2];
        int[] moves = {-1, 0, 1};
        for (int i = 1; i < n - 1; i++) {
            for (int j = 1; j < m - 1; j++) {
                int maxi = 0;
                for (int k = 0; k < 3; k++) {
                    for (int l = 0; l < 3; l++) {
                        int row = i + moves[k];
                        int col = j + moves[l];
                        maxi = Math.max(maxi, grid[row][col]);
                    }
                }
                result[i - 1][j - 1] = maxi;
            }
        }
        return result;
    }
}
